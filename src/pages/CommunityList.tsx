import { useState } from 'react'
import PostCard from '../components/CommunityList/PostCard';
import FilterBar from '../components/CommunityList/FilterBar';
import Pagination from '../components/CommunityList/Pagination';
import { useDummyPosts } from '../utils/useDummydata';
import { filterPosts } from '../utils/filterPosts';

function CommunityListLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="
        mx-auto
        relative
      "
      style={{
        width: '1920px', // 전체 너비
        height: '2873px', // 전체 높이
        paddingTop: '219px', // 상단 NavBar와의 거리
        paddingBottom: '209px', // 하단 페이지네이션과의 거리
        paddingLeft: '488px', // 좌측 간격
        paddingRight: '488px', // 우측 간격
        boxSizing: 'border-box', // 패딩 포함 크기 계산
      }}
    >
      {children}
    </div>
  );
}

export default function PostList() {
  const [categoryFilter, setCategoryFilter] = useState('전체');
  const [searchText] = useState('');
  const [page, setPage] = useState(1);

  const { posts } = useDummyPosts();
  const postsPerPage = 5;

  // 필터링
  const filteredPosts = filterPosts(posts, categoryFilter, searchText);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / postsPerPage));

  // 현재 페이지에 보여줄 게시글
  const startIndex = (page - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const postsToShow = filteredPosts.slice(startIndex, endIndex);

  // 페이지가 totalPages 보다 크면 맞춰서 보정 (예: 필터 변경 시)
  if (page > totalPages) {
    setPage(totalPages);
  }

  return (
    <CommunityListLayout>
      <h2 className="text-2xl font-semibold mb-6">커뮤니티</h2>

      {/* 필터 바 */}
      <FilterBar
        selected={categoryFilter}
        onSelect={(category) => {
          setCategoryFilter(category);
          // 페이지 유지하려면 setPage(1) 주석 처리
          // setPage(1);
        }}
      />

      {/* 경계선 1개만, 12px 마진 */}
      <hr className="border-t border-gray-300 my-3" />

      {/* 게시글 목록 */}
      <div className="space-y-6">
        {postsToShow.length > 0 ? (
          postsToShow.map(post => <PostCard key={post.id} post={post} />)
        ) : (
          <p className="text-center text-gray-500">게시물이 없습니다.</p>
        )}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </CommunityListLayout>
  );
}
