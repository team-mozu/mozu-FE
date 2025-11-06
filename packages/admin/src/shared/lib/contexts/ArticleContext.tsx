import { createContext, type ReactNode, useContext, useState } from "react";

export interface Article {
  id: string;
  articleName: string;
  articleDesc: string;
  articleImg: string | null;
  createdAt: string;
  isDeleted: boolean;
}

// 한 차수(invDeg)별로 선택된 기사 그룹
export interface ClassArticleGroup {
  invDeg: number;
  articles: LessonArticle[]; // 기사 ID 배열
}

interface LessonArticle {
  articleId: string;
  title: string;
}

// Context에서 제공할 타입 정의
interface ArticleContextType {
  classArticles: ClassArticleGroup[];
  addArticles: (invDeg: number, newArticles: LessonArticle[]) => void;
  deleteArticles: (articleIds: string[], invDeg: number) => void;
  resetArticles: () => void; // 선택된 기사 초기화 함수
  filterArticlesByMaxDegree: (maxDegree: number) => void; // 최대 차수를 초과하는 기사 제거
}

// Context 생성
const ArticleContext = createContext<ArticleContextType | undefined>(undefined);

// Provider 컴포넌트
export const ArticleProvider = ({ children }: { children: ReactNode }) => {
  const [classArticles, setClassArticles] = useState<ClassArticleGroup[]>([]);

  // 기사 추가
  const addArticles = (invDeg: number, newArticles: LessonArticle[]) => {
    setClassArticles(prev => {
      const group = prev.find(g => g.invDeg === invDeg);
      if (group) {
        return prev.map(g =>
          g.invDeg === invDeg
            ? {
              ...g,
              articles: [...g.articles, ...newArticles],
            }
            : g
        );
      }
      return [
        ...prev,
        {
          invDeg,
          articles: newArticles,
        },
      ];
    });
  };

  // 기사 삭제
  const deleteArticles = (articleIds: string[], invDeg: number) => {
    setClassArticles(prev =>
      prev.map(g =>
        g.invDeg === invDeg
          ? { ...g, articles: g.articles.filter(article => !articleIds.includes(article.articleId)) }
          : g
      )
    );
  };

  // 선택 기사 초기화
  const resetArticles = () => {
    setClassArticles([]);
  };

  // 최대 차수를 초과하는 기사 제거
  const filterArticlesByMaxDegree = (maxDegree: number) => {
    setClassArticles(prev => 
      prev.filter(group => group.invDeg <= maxDegree)
    );
  };

  return (
    <ArticleContext.Provider
      value={{
        classArticles,
        addArticles,
        deleteArticles,
        resetArticles,
        filterArticlesByMaxDegree,
      }}
    >
      {children}
    </ArticleContext.Provider>
  );
};

// 커스텀 훅
export const useArticle = () => {
  const context = useContext(ArticleContext);
  if (!context) throw new Error("useArticle must be used within an ArticleProvider");
  return context;
};
