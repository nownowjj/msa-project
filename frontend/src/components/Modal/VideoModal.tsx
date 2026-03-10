import styled from 'styled-components';
import { useYoutubeStore } from '../../store/useYoutubeStore';

const VideoModal = () => {
  const { isModalOpen, selectedVideoId, closeVideoModal } = useYoutubeStore();

  if (!isModalOpen || !selectedVideoId) return null;

  return (
    <ModalOverlay className='키키' onClick={closeVideoModal}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={closeVideoModal}>&times;</CloseButton>
        <VideoWrapper>
          <iframe
            src={`https://www.youtube.com/embed/${selectedVideoId}?autoplay=1`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </VideoWrapper>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default VideoModal;

// --- Styled Components ---

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(0, 0, 0, 0.85);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

const ModalContainer = styled.div`
  width: 90%;
  max-width: 1000px;
  position: relative;
`;

const VideoWrapper = styled.div`
  position: relative;
  padding-bottom: 56.25%; // 16:9 Aspect Ratio
  height: 0;
  iframe {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    border-radius: 12px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: -40px; right: 0;
  background: none; border: none;
  color: white; font-size: 30px;
  cursor: pointer;
`;