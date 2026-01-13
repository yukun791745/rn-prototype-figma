import React from 'react';
import { ChatMessage } from '../components/ai-coach/ChatMessage';
import { ChatInput } from '../components/ai-coach/ChatInput';
import { FileAttachment, AttachedFile } from '../components/ai-coach/FileAttachment';

export function AICoachScreen() {
  const [chatInput, setChatInput] = React.useState('');
  const [attachedFiles, setAttachedFiles] = React.useState<AttachedFile[]>([]);
  const [isUploading, setIsUploading] = React.useState(false);

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
      
      if (fileType === 'image') {
        attachedFile.preview = await generateImagePreview(file);
      }
      
      newFiles.push(attachedFile);
    }
    
    setAttachedFiles(prev => [...prev, ...newFiles]);
    setIsUploading(false);
  };

  const getFileType = (file: File): AttachedFile['type'] => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(ext || '')) return 'image';
    if (ext === 'pdf') return 'pdf';
    if (ext === 'csv') return 'csv';
    if (ext === 'txt') return 'txt';
    return 'other';
  };

  const generateImagePreview = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });
  };

  const removeAttachedFile = (id: string) => {
    setAttachedFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleSendMessage = () => {
    if (!chatInput.trim() && attachedFiles.length === 0) return;
    
    const formData = new FormData();
    formData.append('message', chatInput);
    attachedFiles.forEach((file, index) => {
      formData.append(`file${index}`, file.file);
    });
    
    console.log('Sending message:', chatInput, 'with', attachedFiles.length, 'files');
    
    setChatInput('');
    setAttachedFiles([]);
  };

  return (
    <main className="flex flex-col h-[calc(100vh-8rem)] pb-2">
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <ChatMessage
          role="assistant"
          content="こんにちは。トレーニング計画やレース戦略、補給や回復の相談、運動生理学に関する疑問など、どんなことでもお気軽に相談してください。あなたのデータも参考にしながら、一緒に考えていきましょう。"
          timestamp="9:20"
        />
      </div>

      <FileAttachment files={attachedFiles} onRemove={removeAttachedFile} />

      <ChatInput
        value={chatInput}
        onChange={setChatInput}
        onSend={handleSendMessage}
        attachedFiles={attachedFiles}
        onFileSelect={handleFileSelect}
        isUploading={isUploading}
      />
    </main>
  );
}
