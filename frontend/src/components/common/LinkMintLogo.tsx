import styled from 'styled-components';
import LinkMintLogo from '../../assets/linkmint_icon.png';

interface AppIconProps {
  size?: number;
}

const AppIcon = ({ size = 24 }: AppIconProps) => {
  return (
    <Logo 
      src={LinkMintLogo} 
      alt="LinkMint Logo" 
      width={size} 
      height={size}
    />
  );
};

export default AppIcon;

const Logo = styled.img`
    border-radius:8px;
`