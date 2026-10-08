import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Tag, Share2, BookOpen } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { fetchBlogPosts } from '../../lib/dataService';
import { BlogPost } from '../../types';

export const BlogPostDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const posts = await fetchBlogPosts('published');
        const found = posts.find(p => p.slug === slug || p.id === slug);
        setPost(found || posts[0] || null);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-400">
        Loading article...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="py-24 text-center space-y-4 max-w-md mx-auto px-4">
        <h2 className="text-2xl font-bold text-white">Article Not Found</h2>
        <p className="text-sm text-slate-400">The requested article could not be located in our campus gazette.</p>
        <Link to="/blog">
          <Button variant="primary" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Gazette
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <article className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 animate-fade-in font-['Poppins',sans-serif]">
      {/* Back button */}
      <div>
        <Link to="/blog" className="inline-flex items-center gap-2 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Campus Gazette</span>
        </Link>
      </div>

      {/* Header */}
      <header className="space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          {post.tags?.map((t, idx) => (
            <Badge key={idx} variant="purple" size="sm">
              {t}
            </Badge>
          ))}
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-light">
            {post.excerpt}
          </p>
        )}

        <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 border-t border-[#2a2a3e]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center">
              <User className="w-3.5 h-3.5" />
            </div>
            <span className="font-medium text-slate-200">{post.author?.full_name || 'Girls Academy Faculty'}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-purple-400" />
            <span>{new Date(post.published_at || post.created_at || '').toLocaleDateString('en-GB')}</span>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      {post.featured_image_url && (
        <div className="rounded-3xl overflow-hidden border border-[#2a2a3e] aspect-video bg-[#141422]">
          <img
            src={post.featured_image_url}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed space-y-4 text-sm sm:text-base">
        {post.content ? (
          <div className="whitespace-pre-line leading-relaxed">
            {post.content}
          </div>
        ) : (
          <p>Full article transcript will be published shortly by the editorial department.</p>
        )}
      </div>

      {/* Bottom Share & Return bar */}
      <footer className="pt-8 border-t border-[#2a2a3e] flex items-center justify-between">
        <Link to="/blog">
          <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            All Articles
          </Button>
        </Link>
        <Link to="/admissions">
          <Button variant="primary" size="sm">
            Apply for Admissions
          </Button>
        </Link>
      </footer>
    </article>
  );
};
