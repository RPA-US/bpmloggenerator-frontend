import React from 'react';
import { Typography, TypographyProps } from '@mui/material';
import { styled } from '@mui/system';
import { useTranslation } from 'react-i18next';

interface TitleProps extends TypographyProps<'h5', {}> {}

const Title = styled(Typography)<TitleProps>(({theme}) => ({
  marginTop: theme.spacing(3)
}));

const BPMToolConfigurationPage: React.FC = ({}) => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <Title variant="h5">{ t('pages.bpmtool.title') }</Title>
      
      
    </React.Fragment>
  )

}

export default BPMToolConfigurationPage;