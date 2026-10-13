import React from 'react';
import { motion } from 'framer-motion';
import { Facebook, MessageCircle } from 'lucide-react';
import CreateReactScript from './Utils/CreateReactScript';
import { createRoot } from 'react-dom/client';
import Base from './Components/Tailwind/Base';
import HtmlContent from './Utils/HtmlContent';
import Tippy from '@tippyjs/react';

const BlogArticle = ({ previousArticle, article, nextArticle }) => {
  const shareUrl = encodeURIComponent(window.location.href);
  const shareTitle = encodeURIComponent(article.name);

  const socialShareLinks = {
    x: `https://x.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${article.name} ${window.location.href}`)}`,
  };
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-[5%] bg-white mt-16"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <span className="inline-block px-3 py-1 text-xs font-medium text-white uppercase bg-slate-600 rounded-full">
            {article.category.name}
          </span>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-slate-800">
            <HtmlContent html={article.name.replace(/\*(.*?)\*/g, '<span class="font-bold text-pink-500">$1</span>')} />
          </h1>
          <div className="flex items-center mt-2 text-sm text-slate-500">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            {moment(article.post_date).format('LL')}
          </div>
        </motion.div>

        <motion.img
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          src={`/storage/images/post/${article.image}`}
          alt="Article main image"
          className="w-full h-auto rounded-lg shadow-lg mb-8 object-cover object-center aspect-video"
        />

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="prose max-w-none ql-editor"
        >
          <HtmlContent html={article.description} />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 pt-6 border-t border-slate-200"
        >
          <div className="flex justify-between items-center text-sm text-slate-600">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              {article.tags?.filter(x => x.visible && x.status).map(x => <span className='px-2 me-1 rounded-md bg-green-200'>{x.name.trim()}</span>)}
            </div>
            <div className="flex items-center">
              <span className="mr-2">Compartir esta publicación</span>
              <div className="flex space-x-2">
                <Tippy content="Compartir en X">
                  <a href={socialShareLinks.x} target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-700 transition-colors duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 1668.56 1221.19">
                      <path d="M283.94,167.31l386.39,516.64L281.5,1104h87.51l340.42-367.76L984.48,1104h297.8L874.15,558.3l361.92-390.99
                    h-87.51l-313.51,338.7l-253.31-338.7H283.94z M412.63,231.77h136.81l604.13,807.76h-136.81L412.63,231.77z"/>
                    </svg>
                  </a>
                </Tippy>
                <Tippy content="Compartir en Facebook">
                  <a href={socialShareLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 transition-colors duration-200">
                    <Facebook size={20} />
                  </a>
                </Tippy>
                <Tippy content="Compartir en WhatsApp">
                  <a href={socialShareLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-600 transition-colors duration-200">
                    <MessageCircle size={20} />
                  </a>
                </Tippy>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200 text-sm font-medium"
        >
          {
            previousArticle
              ? <Tippy content={previousArticle.name}>
                <a href={`/blog/${previousArticle.id}`} className="text-amber-400 hover:text-amber-500 transition-colors duration-200 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                  Publicación anterior
                </a>
              </Tippy>
              : <span></span>
          }
          {
            nextArticle
              ? <a href="#" className="text-amber-400 hover:text-amber-500 transition-colors duration-200 flex items-center">
                Publicación siguiente
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </a>
              : <span></span>
          }
        </motion.div>
      </div>
    </motion.section>
  );
};

CreateReactScript((el, properties) => {
  createRoot(el).render(<Base {...properties}>
    <BlogArticle {...properties} />
  </Base>);
})