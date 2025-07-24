export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content?: string; // For inline content (optional)
  contentFile?: string; // For markdown file path (optional)
  date: string;
  tags: string[];
  readTime: number;
  featured?: boolean;
  image: string; // Adding image property
}

export const blogPosts: BlogPost[] = [
  {
    id: "bootsector-fundamentals",
    title: "Crafting a Basic Bootsector: Your First Step into OS Development",
    excerpt: "Learn how to write a fundamental bootsector that bridges the gap between firmware and your operating system. We'll explore BIOS interrupts, disk reading, and the magic of those final two bytes: 0xAA55.",
    date: "2024-12-26",
    tags: ["Operating Systems", "Assembly", "x86", "Boot Process", "Low-level Programming"],
    readTime: 8,
    featured: true,
    contentFile: "blog/posts/bootsector-fundamentals.md",
    image: "/neoOSPreview.png"
  },
  {
    id: "page-frame-allocator",
    title: "Building a Page Frame Allocator: Memory Management in neo-OS",
    excerpt: "A deep dive into the design and implementation of the page frame allocator that serves as the foundation for all memory allocation operations in neo-OS.",
    date: "2024-12-19",
    tags: ["Operating Systems", "Memory Management", "Systems Programming", "C++", "x86_64"],
    readTime: 12,
    featured: true,
    contentFile: "blog/posts/page-frame-allocator.md",
    image: "https://miro.medium.com/v2/resize:fit:884/1*tfRfH1cTLe5yTaMjaq4QRA.png"
  }
];

export const getAllTags = (): string[] => {
  const tagSet = new Set<string>();
  blogPosts.forEach(post => {
    post.tags.forEach(tag => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
};

export const getPostsByTag = (tag: string): BlogPost[] => {
  return blogPosts.filter(post => post.tags.includes(tag));
};

export const searchPosts = (query: string): BlogPost[] => {
  const lowercaseQuery = query.toLowerCase();
  return blogPosts.filter(post => 
    post.title.toLowerCase().includes(lowercaseQuery) ||
    post.excerpt.toLowerCase().includes(lowercaseQuery) ||
    post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}; 