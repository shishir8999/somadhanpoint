<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserDocument;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class VaultApiController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $userId = Auth::id() ?? $request->query('userId');
        $docs = UserDocument::where('user_id', $userId)->orderBy('created_at', 'desc')->get();
        return response()->json($docs);
    }

    public function upload(Request $request): JsonResponse
    {
        $user = Auth::user() ?? User::find($request->input('userId')) ?? User::first();

        $name = $request->input('name', 'Document');
        $size = $request->input('size', '1.2 KB');
        $type = $request->input('type', 'text/plain');
        $content = $request->input('content', '');

        $doc = UserDocument::create([
            'user_id' => $user->id,
            'name' => $name,
            'size' => $size,
            'type' => $type,
            'content' => $content,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'ডকুমেন্ট সফলভাবে আপনার ব্যক্তিগত ভল্টে সংরক্ষিত হয়েছে।',
            'document' => $doc
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        UserDocument::where('id', $id)->delete();
        return response()->json([
            'success' => true,
            'message' => 'ডকুমেন্ট মুছে ফেলা হয়েছে।'
        ]);
    }
}
