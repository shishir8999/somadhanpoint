<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ChatMessage;
use App\Models\User;
use App\Services\GeminiAiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AiChatController extends Controller
{
    protected GeminiAiService $geminiService;

    public function __construct(GeminiAiService $geminiService)
    {
        $this->geminiService = $geminiService;
    }

    public function chat(Request $request): JsonResponse
    {
        $messages = $request->input('messages');
        if (!is_array($messages) || empty($messages)) {
            return response()->json(['error' => 'Messages array is required.'], 400);
        }

        $modelId = $request->input('modelId', 'chatgpt-4o');
        $systemPrompt = $request->input('systemPrompt');
        $documentContext = $request->input('documentContext');
        $userName = $request->input('userName');

        // Identify current user
        $userId = Auth::id() ?? $request->input('userId');
        $user = $userId ? User::find($userId) : null;
        if ($user && empty($userName)) {
            $userName = $user->name;
        }

        // Generate response using Gemini Service (with persona instructions + offline fallback)
        $aiResult = $this->geminiService->generateChatResponse(
            $messages,
            $modelId,
            $systemPrompt,
            $documentContext,
            $userName
        );

        // Optionally persist user chat to database
        if ($user) {
            $lastUserMsg = end($messages);
            if (is_array($lastUserMsg) && ($lastUserMsg['role'] ?? '') === 'user') {
                ChatMessage::create([
                    'user_id' => $user->id,
                    'role' => 'user',
                    'content' => $lastUserMsg['content'] ?? '',
                    'model_id' => $modelId,
                    'attached_doc_name' => $lastUserMsg['attachedDocName'] ?? null,
                ]);
            }

            ChatMessage::create([
                'user_id' => $user->id,
                'role' => 'assistant',
                'content' => $aiResult['reply'],
                'model_id' => $modelId,
            ]);

            // Increment user token usage
            $user->increment('token_usage', 350);
        }

        return response()->json($aiResult);
    }
}
