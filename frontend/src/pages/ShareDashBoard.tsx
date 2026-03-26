import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { GlobalAlert } from "../components/common/GlobalAlert";
import ShareContent from "../components/Layout/share/ShareContent";
import ShareHeader from "../components/Layout/share/ShareHeader";
import ShareSidebar from "../components/Layout/share/ShareSidebar";
import SidePanel from "../components/Layout/SidePanel";
import { useSidebarStore } from "../store/useSidebarStore";
import type { ArchiveResponse } from "../types/archive";
import { MainContainer } from "./DashBoard";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchSharedArchives } from "../api/share";
import { useAuthStore } from "../store/useAuthStore";
import { api } from "../api/api";
import { useAlertStore } from "../store/useAlertStore";

const ShareDashBoard = () => {
    const { token } = useParams<{ token: string }>(); // URL에서 토큰 추출
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [selectedArchive, setSelectedArchive] = useState<ArchiveResponse | null>(null);
    const navigate = useNavigate();
    const { isLoggedIn } = useAuthStore();
    const currentId = useAuthStore((state) => state.user?.id);
    const { showAlert } = useAlertStore();
    const { isOpen, closeSidebar } = useSidebarStore();


    // 2. 수정 버튼 클릭 시 실행될 핸들러
    const handleEdit = (archive: ArchiveResponse) => {
        setSelectedArchive(archive); // 선택된 데이터 저장
        setIsPanelOpen(true);        // 패널 열기
    };


    // ✅ 1. 무한 스크롤 데이터 fetch (여기서 한 번만 수행)
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ['sharedArchives', token],
        queryFn: ({ pageParam = 0 }) => fetchSharedArchives(token!, pageParam as number),
        initialPageParam: 0,
        enabled: !!token,
        getNextPageParam: (lastPage) => {
            const { number, totalPages } = lastPage.archives.page;
            return number + 1 < totalPages ? number + 1 : undefined;
        },
    });

    // ✅ 2. 첫 페이지에서 폴더 메타데이터 추출
    const firstPage = data?.pages[0];
    const accessRole = firstPage?.accessRole || "VIEWER";

    // ✅ 3. 모든 아카이브 리스트 통합
    const allArchives = useMemo(() => 
        data?.pages.flatMap(page => page.archives.content) || [], 
    [data]);

    // ✅ 참여 및 리다이렉트 로직
    useEffect(() => {
        const handleAutoJoin = async () => {
        // 1. 로그인 상태가 아니면 아무것도 안 함 (공유 페이지 그대로 노출)
        if (!isLoggedIn || !token) return;
        if(currentId && firstPage?.ownerId == currentId){
            return;
        }

        try {
            // 2. 서버에 참여 요청 (자동으로 folder_member에 추가)
            // 이 API는 내부적으로 현재 세션/토큰의 user_id를 사용합니다.
            await api.post(`/share/auto/${token}`);
            
            // 3. 성공 알림 후 본인 대시보드로 이동
            await showAlert('공유 폴더가 내 보관함에 추가되었습니다.');
            navigate('/dashboard', { replace: true });
            
        } catch (error: any) {
            console.error('참여 실패:', error);
            
            // 이미 참여 중인 경우(예: 409 Conflict 등)에도 대시보드로 이동시키는 것이 UX상 좋습니다.
            if (error.response?.status === 409) {
            navigate('/dashboard', { replace: true });
            } else {
            showAlert('폴더 참여 중 오류가 발생했습니다.');
            }
        }
        };

        handleAutoJoin();
    }, [isLoggedIn, token, navigate]);

    return (
        <>
            {isOpen && <Overlay onClick={closeSidebar} />}
            <ShareHeader />

            <MainContainer $hideOn={true}>
                <ShareSidebar folderInfo={firstPage} />
                <ShareContent
                    archives={allArchives}
                    accessRole={accessRole}
                    onEditClick={handleEdit}
                    hasNextPage={hasNextPage}
                    fetchNextPage={fetchNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                    folderName={firstPage?.folderName}
                    totalElements={firstPage?.archives.page.totalElements}
                />
            </MainContainer>


            <SidePanel
                isOpen={isPanelOpen}
                data={selectedArchive}
                onClose={() => setIsPanelOpen(false)}
            />
            <GlobalAlert />
        </>
    );
};

const Overlay = styled.div`
  display: none; /* 기본(PC)에서는 숨김 */

  @media (max-width: 768px) {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999; /* Sidebar(1000) 바로 아래 */
    
    /* 부드러운 나타남 효과를 원한다면 아래 추가 */
    animation: fadeIn 0.2s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;


export default ShareDashBoard;