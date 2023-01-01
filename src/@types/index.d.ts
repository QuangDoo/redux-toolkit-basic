type Counter = {
  value: number;
};

type UpdateByAction = 'Nhan' | 'Chia';

type Post = {
  id: string;
  title: string;
  description: string;
  publishDate: Date;
  featuredImage: string;
  published: boolean;
};
