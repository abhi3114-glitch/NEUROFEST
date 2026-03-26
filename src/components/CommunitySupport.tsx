import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Heart, Send } from 'lucide-react';
import { toast } from 'sonner';

interface Post {
  id: string;
  author: string;
  role: string;
  avatar: string;
  content: string;
  likes: number;
  comments: number;
  time: string;
  timestamp: string;
}

const mockPosts: Post[] = [
  {
    id: '1',
    author: "Sarah T.",
    role: "Caregiver",
    avatar: "ST",
    content: "Has anyone tried the new sensory room features for winding down before bedtime? It's been a game changer for us this week! The deep breathing really stops meltdowns before they start.",
    likes: 12,
    comments: 4,
    time: "2 hours ago",
    timestamp: new Date().toISOString()
  },
  {
    id: '2',
    author: "Mark J.",
    role: "User",
    avatar: "MJ",
    content: "I finally finished my whole daily routine and got enough stars for a new badge! 🌟 Super proud today.",
    likes: 24,
    comments: 8,
    time: "5 hours ago",
    timestamp: new Date().toISOString()
  }
];

export default function CommunitySupport() {
  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('communityPosts');
    return saved ? JSON.parse(saved) : mockPosts;
  });
  const [newPostContent, setNewPostContent] = useState('');

  useEffect(() => {
    localStorage.setItem('communityPosts', JSON.stringify(posts));
  }, [posts]);

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;

    const newPost: Post = {
      id: Date.now().toString(),
      author: "You",
      role: "User",
      avatar: "YU",
      content: newPostContent.trim(),
      likes: 0,
      comments: 0,
      time: "Just now",
      timestamp: new Date().toISOString()
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
    toast.success("Post shared with the community!");
  };

  const handleLike = (id: string) => {
    setPosts(posts.map(p => {
      if (p.id === id) {
        return { ...p, likes: p.likes + 1 };
      }
      return p;
    }));
  };

  return (
    <Card className="neuronest-card w-full animate-in fade-in slide-in-from-bottom-4">
      <CardHeader>
        <CardTitle className="text-2xl text-white">Community Hub</CardTitle>
        <CardDescription className="text-gray-400">A secure, moderated space to share advice and connect</CardDescription>
      </CardHeader>
      <CardContent>
        {/* New Post Box */}
        <div className="flex gap-3 mb-8 bg-zinc-900/50 p-4 rounded-xl border border-white/10 shadow-inner">
          <Input 
            placeholder="Share an update or ask a question..." 
            value={newPostContent} 
            onChange={e => setNewPostContent(e.target.value)} 
            className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-xl"
            onKeyDown={(e) => { if(e.key === 'Enter') handleCreatePost(); }}
          />
          <Button onClick={handleCreatePost} disabled={!newPostContent.trim()} className="neuronest-button bg-blue-600 hover:bg-blue-700 text-white">
            <Send className="w-4 h-4 mr-2" /> Post
          </Button>
        </div>

        {/* Post Feed */}
        <div className="space-y-6">
          {posts.map((post) => (
             <div key={post.id} className="p-6 border border-white/10 rounded-2xl bg-zinc-900/40 backdrop-blur-md shadow-lg hover:bg-zinc-800/60 hover:border-white/20 transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center gap-4 mb-4">
                   <div className="w-12 h-12 rounded-full bg-blue-500/20 ring-1 ring-blue-500/50 text-blue-400 font-bold flex items-center justify-center text-lg shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                     {post.avatar}
                   </div>
                   <div>
                     <p className="font-bold text-white text-lg flex items-center gap-3">
                       {post.author} 
                       <span className="text-xs font-semibold text-blue-300 bg-blue-500/20 ring-1 ring-blue-500/40 px-3 py-1 rounded-full uppercase tracking-wider">{post.role}</span>
                     </p>
                     <p className="text-sm text-gray-400 mt-1">{post.time}</p>
                   </div>
                </div>
                <p className="text-gray-200 text-lg leading-relaxed mb-6">{post.content}</p>
                <div className="flex gap-8 text-gray-500 font-medium border-t border-white/10 pt-4">
                   <button onClick={() => handleLike(post.id)} className="flex items-center gap-2 hover:text-pink-500 transition-colors">
                     <Heart className="w-6 h-6" /> {post.likes}
                   </button>
                   <button className="flex items-center gap-2 hover:text-blue-500 transition-colors">
                     <MessageCircle className="w-6 h-6" /> {post.comments}
                   </button>
                </div>
             </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
