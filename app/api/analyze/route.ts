import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Supabase client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
    try {
        // 1. Receive Verilog file from frontend
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Read file content
        const code_content = await file.text();
        const file_name = file.name;

        // 2. Send to Gemini AI for analysis
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = `Analyze this Verilog code and provide:
1. Code quality assessment
2. Potential bugs or errors
3. Optimization suggestions
4. Synthesis warnings
5. Best practices violations

Verilog Code:
${code_content}`;

        const result = await model.generateContent(prompt);
        const analysis_result = result.response.text();

        // 3. Store results in Supabase
        const { data, error } = await supabase
            .from('verilog_analyses')
            .insert([
                {
                    file_name,
                    code_content,
                    analysis_result: { analysis: analysis_result }
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json({ error: 'Failed to save analysis' }, { status: 500 });
        }

        // 4. Return analysis to frontend
        return NextResponse.json({
            success: true,
            data: {
                id: data.id,
                file_name: data.file_name,
                analysis: analysis_result,
                created_at: data.created_at
            }
        });

    } catch (error) {
        console.error('Analysis error:', error);
        return NextResponse.json(
            { error: 'Failed to analyze code' },
            { status: 500 }
        );
    }
}
