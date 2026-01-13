import { NewsFeedItem, NewsItem } from './NewsFeedItem';

interface NewsFeedProps {
  items: NewsItem[];
  autoTranslate: boolean;
  onViewJapaneseSummary?: (itemId: string) => void;
  onItemClick?: (url: string) => void;
}

export function NewsFeed({
  items,
  autoTranslate,
  onViewJapaneseSummary,
  onItemClick,
}: NewsFeedProps) {
  if (items.length === 0) {
    return (
      <div className="px-4 py-12 text-center">
        <p className="text-sm text-slate-400">
          選択した条件に一致するニュースがありません
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 space-y-3 pb-4">
      {items.map((item) => (
        <NewsFeedItem
          key={item.id}
          item={item}
          autoTranslate={autoTranslate}
          onViewJapaneseSummary={onViewJapaneseSummary}
          onClick={onItemClick}
        />
      ))}
    </div>
  );
}