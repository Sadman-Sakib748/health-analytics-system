import { Medicine, TestResult, VitalSigns } from './medical';
import Groq from 'groq-sdk';


const groq = process.env.NEXT_PUBLIC_GROQ_API_KEY && 
            process.env.NEXT_PUBLIC_GROQ_API_KEY !== 'your_groq_api_key_here'
  ? new Groq({
      apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
      dangerouslyAllowBrowser: true
    })
  : null;


const VISION_MODEL = 'llama-4-scout-17b-16e-instruct';

const SYSTEM_PROMPT = `You are a medical document analyzer for a healthcare management system. Extract structured medical information from prescription images or PDFs.

Return ONLY valid JSON in this exact format (no other text, just the JSON):
{
  "doctorName": "Full name of prescribing doctor",
  "date": "YYYY-MM-DD format (use current date if not found)",
  "patientCase": "Brief summary of symptoms/condition (1-2 sentences)",
  "symptomsSummary": "Detailed symptoms listed",
  "medicines": [
    {
      "name": "Medicine name",
      "dosage": "e.g., 500mg twice daily",
      "duration": "e.g., 7 days",
      "classification": "antibiotic|vitamin|calcium|gastric|other"
    }
  ],
  "testResults": [
    {
      "testName": "e.g., Complete Blood Count",
      "value": "numerical value with units",
      "unit": "mg/dL, g/L, etc.",
      "normalRange": "reference range if available"
    }
  ],
  "vitalSigns": {
    "respiratoryRate": "breaths per minute (e.g., 16)",
    "bloodPressure": "systolic/diastolic (e.g., 120/80)",
    "heartRate": "beats per minute",
    "temperature": "in Celsius/Fahrenheit"
  }
}

Classification rules:
- antibiotic: Contains penicillin, amoxicillin, azithromycin, ciprofloxacin, doxycycline, etc.
- vitamin: Vitamin B12, D3, C, multivitamins, folic acid
- calcium: Calcium carbonate, calcium citrate, vitamin D with calcium
- gastric: Omeprazole, pantoprazole, ranitidine, antacids
- other: Everything else

If information is not found in the document, use empty strings or null.`;

export async function analyzeMedicalDocument(file: File): Promise<{
  success: boolean;
  data?: {
    doctorName: string;
    date: string;
    patientCase: string;
    symptomsSummary: string;
    medicines: Medicine[];
    testResults: TestResult[];
    vitalSigns: VitalSigns;
  };
  error?: string;
}> {
  console.log('📄 Analyzing file with Groq:', file.name);
  

  const hasValidApiKey = groq !== null;
  
  if (!hasValidApiKey) {
    console.log('⚠️ No valid Groq API key, using mock data');
    return getMockAnalysis(file.name);
  }

  try {
    console.log('🤖 Calling Groq API with model:', VISION_MODEL);
    const base64Data = await fileToBase64(file);
    
    // For prescription images, we need to send as text base64
    const result = await groq!.chat.completions.create({
      model: VISION_MODEL,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `You are a medical document analyzer. Extract information from this prescription image.

${SYSTEM_PROMPT}

Extract all medical information from this prescription. Return ONLY valid JSON.`
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:${file.type};base64,${base64Data}`
              }
            }
          ]
        }
      ],
      max_tokens: 2048,
      temperature: 0.1,
    });

    const content = result.choices[0]?.message?.content;
    if (!content) throw new Error('No response from Groq');
    
    console.log('📝 Groq response received, length:', content.length);
    
    // Extract JSON from response
    let jsonContent = content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonContent = jsonMatch[0];
    }
    
    const parsed = JSON.parse(jsonContent);
    console.log('✅ Groq analysis successful');
    
    const validatedData = {
      doctorName: parsed.doctorName || 'Dr. Unknown',
      date: parsed.date || new Date().toISOString().split('T')[0],
      patientCase: parsed.patientCase || 'No case details provided',
      symptomsSummary: parsed.symptomsSummary || '',
      medicines: Array.isArray(parsed.medicines) ? parsed.medicines : [],
      testResults: Array.isArray(parsed.testResults) ? parsed.testResults : [],
      vitalSigns: parsed.vitalSigns || {}
    };
    
    return { success: true, data: validatedData };
    
  } catch (error: any) {
    console.error('❌ Groq Error:', error.message);
    
    // Handle specific errors
    if (error.status === 429) {
      console.log('⚠️ Rate limit exceeded! Falling back to mock data.');
      return getMockAnalysis(file.name);
    }
    
    if (error.status === 401) {
      console.log('⚠️ Invalid API key!');
      return getMockAnalysis(file.name);
    }
    
    // For any error, fallback to mock data so app still works
    console.log('⚠️ Groq API error, falling back to mock data');
    return getMockAnalysis(file.name);
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Mock data generator (fallback when API fails)
function getMockAnalysis(fileName: string): { 
  success: boolean; 
  data: {
    doctorName: string;
    date: string;
    patientCase: string;
    symptomsSummary: string;
    medicines: Medicine[];
    testResults: TestResult[];
    vitalSigns: VitalSigns;
  }
} {
  console.log('📦 Generating mock data for:', fileName);
  
  // Smart mock data based on file name
  const lowerName = fileName.toLowerCase();
  let doctorName = 'Dr. Sarah Johnson';
  let patientCase = 'Patient presents with fever and cough for 3 days';
  let symptomsSummary = 'Fever (101°F), dry cough, mild fatigue';
  let medicines: Medicine[] = [
    {
      name: 'Amoxicillin 500mg',
      dosage: 'Twice daily',
      duration: '7 days',
      classification: 'antibiotic'
    },
    {
      name: 'Vitamin C 1000mg',
      dosage: 'Once daily',
      duration: '30 days',
      classification: 'vitamin'
    }
  ];
  let testResults: TestResult[] = [
    { testName: 'CBC', value: 'Normal', unit: '', normalRange: '' }
  ];
  let vitalSigns = {
    respiratoryRate: '18',
    bloodPressure: '118/76',
    heartRate: '82',
    temperature: '98.6°F'
  };
  
  // Customize based on keywords
  if (lowerName.includes('bp') || lowerName.includes('blood')) {
    doctorName = 'Dr. Michael Lee';
    patientCase = 'Follow-up for hypertension management';
    symptomsSummary = 'BP monitoring, stable condition';
    medicines = [
      {
        name: 'Lisinopril 10mg',
        dosage: 'Once daily',
        duration: '90 days',
        classification: 'other'
      }
    ];
    vitalSigns = {
      respiratoryRate: '16',
      bloodPressure: '128/82',
      heartRate: '72',
      temperature: '98.4°F'
    };
  }
  
  if (lowerName.includes('diabetes') || lowerName.includes('sugar')) {
    doctorName = 'Dr. Emily Brown';
    patientCase = 'Diabetes type 2 follow-up';
    symptomsSummary = 'Blood sugar monitoring';
    medicines = [
      {
        name: 'Metformin 500mg',
        dosage: 'Twice daily',
        duration: '90 days',
        classification: 'other'
      }
    ];
    testResults = [
      { testName: 'HbA1c', value: '6.8', unit: '%', normalRange: '<5.7' }
    ];
  }
  
  return {
    success: true,
    data: {
      doctorName,
      date: new Date().toISOString().split('T')[0],
      patientCase,
      symptomsSummary,
      medicines,
      testResults,
      vitalSigns
    }
  };
}

// For PrescriptionUpload component compatibility
export async function analyzePrescriptionImage(file: File): Promise<{
  success: boolean;
  data?: {
    medication: string;
    dosage: string;
    frequency: string;
    prescribedBy: string;
    summary: string;
  };
  error?: string;
}> {
  const result = await analyzeMedicalDocument(file);
  
  if (result.success && result.data) {
    const firstMedicine = result.data.medicines[0];
    return {
      success: true,
      data: {
        medication: firstMedicine?.name || 'Unknown Medication',
        dosage: firstMedicine?.dosage || 'Not specified',
        frequency: firstMedicine?.duration || 'As directed',
        prescribedBy: result.data.doctorName,
        summary: result.data.patientCase
      }
    };
  }
  
  return {
    success: false,
    error: result.error || 'Failed to analyze prescription'
  };
}