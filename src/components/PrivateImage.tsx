import React, { useState, createRef } from 'react';
import { useSelector } from 'react-redux';
import { authSelector } from 'features/auth/slice';
import ScreenshotRepository from 'infrastructure/repositories/image';

const screenshotRepository = new ScreenshotRepository();

export interface PrivateImageProps extends React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {

}

const PrivateImage: React.FC<PrivateImageProps> = (props) => {
  const { token } = useSelector(authSelector);

  const [ alt, setAlt ] = useState('loading');
  const [ src, setSrc ] = useState('');

  React.useEffect(() => {
    (async () => {
      try {
        const blob = await screenshotRepository.get(props.src ?? '', token ?? '');

        console.log("blob: ", blob);
        
        const objectURL = URL.createObjectURL(blob);
        setSrc(objectURL)
        setAlt(props.alt ?? '');
      } catch (ex) {
        console.error('error loading private image', ex);
        setAlt('error');
      }
    })()
  }, []);

  return (
      <img {...props} src={src} alt={alt} />
  );

};

export default PrivateImage;