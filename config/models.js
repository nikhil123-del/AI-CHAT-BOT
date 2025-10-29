// Groq model configurations

export const GROQ_MODELS = {
    'llama-3.3-70b-versatile': {
        name: 'Llama 3.3 70B Versatile',
        description: 'Best for general-purpose tasks, creative writing, and complex reasoning',
        maxTokens: 8192,
        contextWindow: 128000,
        speed: 'fast',
        recommended: true,
        icon: '🦙'
    },
    'llama-3.1-70b-versatile': {
        name: 'Llama 3.1 70B Versatile',
        description: 'Excellent for coding, analysis, and detailed explanations',
        maxTokens: 8192,
        contextWindow: 128000,
        speed: 'fast',
        recommended: false,
        icon: '🦙'
    },
    'llama-3.1-8b-instant': {
        name: 'Llama 3.1 8B Instant',
        description: 'Lightning-fast responses for simple queries',
        maxTokens: 8192,
        contextWindow: 128000,
        speed: 'ultra-fast',
        recommended: false,
        icon: '⚡'
    },
    'mixtral-8x7b-32768': {
        name: 'Mixtral 8x7B',
        description: 'Great for coding tasks and technical discussions',
        maxTokens: 32768,
        contextWindow: 32768,
        speed: 'medium',
        recommended: false,
        icon: '🔧'
    },
    'gemma2-9b-it': {
        name: 'Gemma 2 9B',
        description: 'Balanced performance for various tasks',
        maxTokens: 8192,
        contextWindow: 8192,
        speed: 'fast',
        recommended: false,
        icon: '💎'
    },
    'gemma-7b-it': {
        name: 'Gemma 7B',
        description: 'Efficient model for everyday conversations',
        maxTokens: 8192,
        contextWindow: 8192,
        speed: 'fast',
        recommended: false,
        icon: '💎'
    }
};

// Get model info
export function getModelInfo(modelId) {
    return GROQ_MODELS[modelId] || null;
}

// Get all available models
export function getAllModels() {
    return Object.entries(GROQ_MODELS).map(([id, info]) => ({
        id,
        ...info
    }));
}

// Get recommended models
export function getRecommendedModels() {
    return Object.entries(GROQ_MODELS)
        .filter(([_, info]) => info.recommended)
        .map(([id, info]) => ({ id, ...info }));
}

// Get fastest models
export function getFastestModels() {
    return Object.entries(GROQ_MODELS)
        .filter(([_, info]) => info.speed === 'ultra-fast' || info.speed === 'fast')
        .map(([id, info]) => ({ id, ...info }));
}

// Model selection helper
export function selectBestModel(task) {
    const taskModelMap = {
        'coding': 'mixtral-8x7b-32768',
        'creative': 'llama-3.3-70b-versatile',
        'fast': 'llama-3.1-8b-instant',
        'analysis': 'llama-3.1-70b-versatile',
        'general': 'llama-3.3-70b-versatile'
    };
    
    return taskModelMap[task] || 'llama-3.3-70b-versatile';
}

// System prompts for different use cases
export const SYSTEM_PROMPTS = {
    friendly: `You are a friendly, helpful, and enthusiastic AI assistant. Your responses should be:
- Warm and conversational, like talking to a friend
- Clear and easy to understand
- Encouraging and positive
- Helpful and informative
- Use emojis occasionally to add personality (but don't overdo it)
- Break down complex topics into simple explanations
- Ask follow-up questions when appropriate to better help the user

Always aim to make the user feel comfortable and supported in their learning or problem-solving journey!`,

    professional: `You are a professional AI assistant focused on providing accurate, concise, and well-structured information. Your responses should be:
- Clear and to the point
- Well-organized with proper formatting
- Factual and evidence-based
- Professional in tone
- Include relevant examples when helpful
- Cite sources when appropriate

Maintain a respectful and professional demeanor at all times.`,

    creative: `You are a creative AI assistant that helps with imaginative and artistic tasks. Your responses should be:
- Imaginative and inspiring
- Rich in descriptive language
- Encouraging of creative thinking
- Supportive of artistic expression
- Willing to explore unconventional ideas
- Enthusiastic about creative projects

Help users unlock their creative potential!`,

    technical: `You are a technical AI assistant specialized in programming, engineering, and technology. Your responses should be:
- Technically accurate and precise
- Include code examples when relevant
- Explain complex concepts clearly
- Follow best practices and standards
- Provide optimization suggestions
- Consider edge cases and error handling

Help users solve technical problems effectively.`,

    educational: `You are an educational AI assistant focused on teaching and learning. Your responses should be:
- Patient and encouraging
- Break down complex topics into digestible parts
- Use analogies and examples
- Check for understanding
- Provide practice opportunities
- Adapt to the learner's level
- Celebrate progress and learning

Make learning enjoyable and accessible for everyone!`
};

// Get system prompt by type
export function getSystemPrompt(type = 'friendly') {
    return SYSTEM_PROMPTS[type] || SYSTEM_PROMPTS.friendly;
}
