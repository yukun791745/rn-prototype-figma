/**
 * カスタムフック: AIコーチとのチャット
 */

import { useState } from 'react';
import { chatWithAI } from '../lib/api';
import type { ChatMessage } from '../types/api';

export function useAIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        'こんにちは。トレーニング計画やレース戦略、補給や回復の相談、運動生理学に関する疑問など、どんなことでもお気軽に相談してください。あなたのデータも参考にしながら、一緒に考えていきましょう。',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (
    content: string,
    attachments?: File[],
    context?: {
      ctl?: number;
      atl?: number;
      tsb?: number;
    }
  ) => {
    if (!content.trim() && (!attachments || attachments.length === 0)) {
      return;
    }

    // ユーザーメッセージを追加
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
      attachments: attachments?.map((file) => ({
        id: `${Date.now()}-${file.name}`,
        type: file.type.startsWith('image/') ? 'image' : 'other',
        name: file.name,
        size: file.size,
      })),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setError(null);

    try {
      // AIに送信
      const response = await chatWithAI({
        message: content,
        context,
        attachments,
      });

      if (response.success && response.data) {
        // AIの返答を追加
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.data.response,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(response.error || 'AIからの応答を取得できませんでした');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '不明なエラー';
      setError(errorMessage);
      console.error('AI chat error:', err);

      // エラーメッセージを表示
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `申し訳ありません。エラーが発生しました: ${errorMessage}`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content:
          'こんにちは。トレーニング計画やレース戦略、補給や回復の相談、運動生理学に関する疑問など、どんなことでもお気軽に相談してください。あなたのデータも参考にしながら、一緒に考えていきましょう。',
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearMessages,
  };
}
