// 공통 페이징 구조 인터페이스
export interface PageResponse<T> {
    content: T[];
    page: {
        size: number;
        totalElements: number;
        totalPages: number;
        number: number;
    };
}