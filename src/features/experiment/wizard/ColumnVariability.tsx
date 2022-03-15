import React, { useContext, useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Theme, Typography, Grid, CircularProgress } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '@emotion/react';
import { wizardSelector, loadDataAndInitValues } from 'features/experiment/wizard/slice';
import NextButton from 'components/NextButton';
import LogForm from './LogForm';

const ColumnVariability: React.FC = () => {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext) as Theme;
  const { variant } = useParams<{ variant: string }>();
  const { act } = useParams<{ act: string }>();
  const dispatch = useDispatch();
  // If you want a function to run on mount you use useEffect with an empty dependency array
  const { isLoading } = useSelector(wizardSelector);
  useEffect(() => {
    dispatch(loadDataAndInitValues(variant, act, true));
  }, [variant, act])

  return (
      <div>
        <Typography variant="h5">
          {t('features.experiment.create.title')}
          <NextButton to="/case-variability" />
        </Typography>
        {isLoading ?
          (<Grid container justifyContent="center" style={{ marginTop: theme.spacing(3) }}>
            <CircularProgress color="secondary" />
          </Grid>)
          :
          <LogForm />
        }
      </div>
  );
}

export default ColumnVariability;