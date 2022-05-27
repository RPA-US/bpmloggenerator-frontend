import React, { useContext, useEffect, useReducer } from 'react';
import { useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import configuration from "infrastructure/util/configuration";
import { Button,  Theme, Typography } from '@mui/material';
import { ThemeContext } from '@emotion/react';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/system';
import { experimentRepository } from './slice';
import { downloadFile, experimentDTOToExperimentType } from './utils';

import { authSelector } from 'features/auth/slice';
import { ExperimentDTO } from 'infrastructure/http/dto/experiment';

import List from './List';
import { Experiment } from './types';

const FlexDiv = styled('div')(({ theme }) => ({
  display: 'flex',
  flexFlow: 'row wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(4)
}))

const viewInitialState = {
  loading: false,
  page: 0,
  hasNext: false,
  list: [],
  error: null,
};

function reducer(state: any, action: any) {
  switch (action.type) {
    case 'load':
      return { 
        ...state,
        loading: true,
        error: null,
      };
    case 'load_success':
      return {
        ...state,
        ...action.payload,
        loading: false
      }
    case 'load_error':
      return {
        viewInitialState,
        error: action.payload
      }
  }
}

const downloadResults = async (experimentId: number, token: string) => {
  try {
    const { filename, blob }: any = await experimentRepository.download(experimentId, token);
    downloadFile(filename, blob);    
  } catch (ex) {
    console.error('error downloading experiment result', ex);
  }
}

const PublicExperimentsList: React.FC = () => {
  const [ state, dispatch ] = useReducer(reducer, viewInitialState);
  const { token } = useSelector(authSelector);
  const theme = useContext(ThemeContext) as Theme;
  const { t } = useTranslation();

  const loadExperiments = async () => {
    // first page already loaded
    if (state.page === 0 && state.list.length > 0) {
      return false;
    }
    dispatch({ type: 'load' });
    const page: number = state.hasNext ? state.page + 1 : state.page;
    try {
      const response = await experimentRepository.findPublic(page, token ?? '');
      const list = response.results.map((exp: ExperimentDTO) => experimentDTOToExperimentType(exp));
      dispatch({
        type: 'load_success',
        payload: {
          list: state.list.concat(list),
          page: page,
          hasNext: response.next != null
        }
      })
    } catch (ex) {
      dispatch({ type: 'load_error', payload: ex });
    }    
  }

  useEffect(() => {
    loadExperiments();
  }, [])

  return (
    <>
      <FlexDiv>
        <Typography variant="h4">
          Lista de artefactos
        </Typography>
      </FlexDiv>
      
      <List
        loadMoreFn={ () => loadExperiments() }
        loadMoreDisabled={ state.list.length > 0 && !state.hasNext }
        isLoading={ state.loading }
        experiments={ state.list as Experiment[] }
        downloadFn = { (id: number) => downloadResults(id, token ?? '') }
      />
    </>
  )
}

export default PublicExperimentsList;