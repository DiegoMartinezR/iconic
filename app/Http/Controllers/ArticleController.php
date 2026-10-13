<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;

class ArticleController extends BasicController
{
    public $reactView = 'BlogArticle';
    public $reactRootView = 'public';

    public function setReactViewProperties(Request $request)
    {
        if (!$request->articleId) return redirect()->route('Blog.jsx');

        $currentArticle = Post::with(['category', 'tags'])->find($request->articleId);

        $nextArticle = Post::select(['name', 'id'])
            ->where('post_date', '>', $currentArticle->post_date)
            ->orderBy('post_date', 'asc')
            ->first();

        $previousArticle = Post::select(['name', 'id'])
            ->where('post_date', '<', $currentArticle->post_date)
            ->orderBy('post_date', 'desc')
            ->first();

        return [
            'previousArticle' => $previousArticle,
            'article' => $currentArticle,
            'nextArticle' => $nextArticle
        ];
    }
}
