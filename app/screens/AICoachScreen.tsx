import React from 'react';
import { Header } from '../components/navigation/Header';
import { ChatMessage } from '../components/ai-coach/ChatMessage';
import { ChatInput } from '../components/ai-coach/ChatInput';
import { FileAttachment, AttachedFile } from '../components/ai-coach/FileAttachment';

export function AICoachScreen() {
  const today = "2026年1月10日（金）";
  const tsb = 25;
  const tsbDelta = 11;
  const atl = 62;

  // Chat input state
  const [chatInput, setChatInput] = React.useState('');

  // File attachment state
  const [attachedFiles, setAttachedFiles] = React.useState<AttachedFile[]>([]);
  const [isUploading, setIsUploading] = React.useState(false);

  // Handle file selection
  const handleFileSelect = async (files: FileList) => {
    if (files.length === 0) return;

    setIsUploading(true);

    const newFiles: AttachedFile[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileType = getFileType(file);

      const attachedFile: AttachedFile = {
        id: `${Date.now()}-${i}`,
        file,
        type: fileType,
        size: file.size,
        name: file.name
      };

      // Generate preview for images
      if (fileType === 'image') {
        attachedFile.preview = await generateImagePreview(file);
      }

      newFiles.push(attachedFile);
    }

    setAttachedFiles(prev => [...prev, ...newFiles]);
    setIsUploading(false);
  };

  // Get file type from file
  const getFileType = (file: File): AttachedFile['type'] => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(ext || '')) return 'image';
    if (ext === 'pdf') return 'pdf';
    if (ext === 'csv') return 'csv';
    if (ext === 'txt') return 'txt';
    return 'other';
  };

  // Generate image preview
  const generateImagePreview = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });
  };

  // Remove attached file
  const removeAttachedFile = (id: string) => {
    setAttachedFiles(prev => prev.filter(f => f.id !== id));
  };

  // Handle send message
  const handleSendMessage = () => {
    if (!chatInput.trim() && attachedFiles.length === 0) return;

    // TODO: Implement actual message sending with FormData
    const formData = new FormData();
    formData.append('message', chatInput);
    attachedFiles.forEach((file, index) => {
      formData.append(`file${index}`, file.file);
    });

    console.log('Sending message:', chatInput, 'with', attachedFiles.length, 'files');

    // Reset
    setChatInput('');
    setAttachedFiles([]);
  };

  return (
    <>
      <Header
        date={today}
        title="AIコーチ"
        subtitle={`今日のコンディション：良好（TSB +${tsbDelta}） / 疲労：やや高（ATL ${atl}）`}
      />

      <main className="flex flex-col h-[calc(100vh-8rem)] pb-2">
        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          <ChatMessage
            role="assistant"
            content="こんにちは。トレーニング計画やレース戦略、補給や回復の相談、運動生理学に関する疑問など、どんなことでもお気軽に相談してください。あなたのデータも参考にしながら、一緒に考えていきましょう。"
            timestamp="9:20"
          />
        </div>

        {/* Attached Files Preview */}
        <FileAttachment files={attachedFiles} onRemove={removeAttachedFile} />

        {/* Input Bar */}
        <ChatInput
          value={chatInput}
          onChange={setChatInput}
          onSend={handleSendMessage}
          attachedFiles={attachedFiles}
          onFileSelect={handleFileSelect}
          isUploading={isUploading}
        />
      </main>
    </>
  );
}
