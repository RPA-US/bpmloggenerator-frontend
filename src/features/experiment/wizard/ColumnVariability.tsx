import React, { useContext, useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Theme, Typography, Grid, CircularProgress } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '@emotion/react';
import configuration from "infrastructure/util/configuration";
import { wizardSelector, loadDataAndInitValues, wizardSlice } from 'features/experiment/wizard/slice';
import BackButton from 'components/BackButton';
import LogForm from './LogForm';

const ColumnVariability: React.FC = () => {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext) as Theme;
  const { variant } = useParams<{ variant: string }>();
  const { act } = useParams<{ act: string }>();
  const dispatch = useDispatch();
  const { seed } = useSelector(wizardSelector);
  // If you want a function to run on mount you use useEffect with an empty dependency array
  const { isLoading } = useSelector(wizardSelector);

  useEffect(() => {
    for (let varTMP of Object.keys(seed)) {
      for (let actTMP of Object.keys(seed[varTMP])) {
        if (seed[varTMP][actTMP]["Screenshot"]["name"] === "") {
          dispatch(wizardSlice.actions.setFunctionNameVariabilityFunction({ variant: varTMP, act: actTMP, column: "Screenshot", function_name: "image_copy_renamed" }));
        }
      }
    }
    dispatch(loadDataAndInitValues(variant, act, true));
  }, [variant, act])

  return (
    <div>
      <Typography variant="h5">
        <BackButton to={`${configuration.PREFIX}/case-variability`} />
        {t('features.wizard.activitySelection.variant')} {variant} / {t('features.wizard.activitySelection.activity')} {act}
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