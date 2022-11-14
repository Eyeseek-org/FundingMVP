import styled from 'styled-components';
import { motion } from 'framer-motion';

const Card = styled(motion.div)`
  position: relative;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid #3c3c3c;
  border-radius: 15px;
  padding-left: 2em;
  padding-right: 1em;
  width: 40%;
  max-width: 800px;
  padding-top: 2em;
  margin: 2em;
  transition: 0.2s;
  &:hover {
    opacity: 0.8;
    background: rgba(5, 0, 0, 0.4);
    cursor: pointer;
  }
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Title = styled.div`
  margin-top: 1em;
  font-family: 'Gemunu Libre';
  font-style: normal;
  font-weight: 500;
  font-size: 1.7em;
  color: #b0f6ff;
  @media (min-width: 1580px) {
    font-size: 2.2em;
  }
`;

const Description = styled.div`
  margin-top: 2em;
  margin-bottom: 2em;
  font-family: 'Neucha';
  letter-spacing: 0.8px;
  font-weight: 300;
  font-size: 1.1em;
  color: #ffffff;
  @media (min-width: 1580px) {
    font-size: 1.4em;
  }
`;

const IconBox = styled.div``;

const RightAnimation = styled(motion.div)`
  position: absolute;
  right: 0;
  opacity: 0;
  top: 0;
`;

const FeatureCard = ({ title, description, icon, onClick, anim }) => {
  return (
    <Card whileHover={{ scale: 1.05 }} onClick={onClick}>
      <IconBox>{icon} </IconBox>
      <RightAnimation whileHover={{ opacity: 1, scale: 1.3 }} transition={{ duration: 2 }} exit={{ opacity: 0 }}>
        {anim}
      </RightAnimation>
      <Title>{title}</Title>
      <Description>{description}</Description>
    </Card>
  );
};

export default FeatureCard;
