import { createContext, type ReactNode, useContext, useState } from "react";
import type { Article } from "@/apis/class/type";

// 한 차수(invDeg)별로 선택된 기사 그룹
interface ClassArticleGroup {
  invDeg: number;
  articles: number[]; // 기사 ID 배열
}

// Context에서 제공할 타입 정의
interface ArticleContextType {
  classArticles: ClassArticleGroup[];
  addArticles: (invDeg: number, newArticles: Article[]) => void;
  deleteArticles: (articleIds: number[], invDeg: number) => void;
  resetArticles: () => void; // 선택된 기사 초기화 함수
}

// Context 생성
const ArticleContext = createContext<ArticleContextType | undefined>(undefined);

// Provider 컴포넌트
export const ArticleProvider = ({ children }: { children: ReactNode }) => {
  const [classArticles, setClassArticles] = useState<ClassArticleGroup[]>([]);

  // 기사 추가
  const addArticles = (invDeg: number, newArticles: Article[]) => {
    setClassArticles(prev => {
      const group = prev.find(g => g.invDeg === invDeg);
      if (group) {
        return prev.map(g =>
          g.invDeg === invDeg
            ? {
                ...g,
                articles: [
                  ...g.articles,
                  ...newArticles.map(a => a.id),
                ],
              }
            : g,
        );
      }
      return [
        ...prev,
        {
          invDeg,
          articles: newArticles.map(a => a.id),
        },
      ];
    });
  };

  // 기사 삭제
  const deleteArticles = (articleIds: number[], invDeg: number) => {
    setClassArticles(prev =>
      prev.map(g =>
        g.invDeg === invDeg
          ? {
              ...g,
              articles: g.articles.filter(id => !articleIds.includes(id)),
            }
          : g,
      ),
    );
  };

  // 선택 기사 초기화
  const resetArticles = () => {
    setClassArticles([]);
  };

  return (
    <ArticleContext.Provider
      value={{
        classArticles,
        addArticles,
        deleteArticles,
        resetArticles,
      }}>
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
