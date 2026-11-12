export interface Program {
  id: string;
  category: string;
  categoryLabel: string;
  title: string;
  description: string;
  raisedPercentage: number;
  daysLeft: number;
  raisedAmount: string;
  targetAmount: string;
  image: string;
  categoryColor: string;
  campaigner?: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  imgUrl: string;
  summary: string;
  content: string;
  categoryColor: string;
}
