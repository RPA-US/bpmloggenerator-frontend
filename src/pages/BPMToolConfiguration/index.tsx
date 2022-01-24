import React, { useContext, useState } from 'react';
import { Card, CardContent, TextField, Theme, Typography, TypographyProps } from '@mui/material';
import { styled } from '@mui/system';
import { ThemeContext } from '@emotion/react';
import { useTranslation } from 'react-i18next';
import FormInput from 'components/FormInput';
import FileUpload from 'components/FileUpload';
import InputGroup from 'components/InputGroup';

const BPMToolConfigurationPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext) as Theme;

  console.log('theme', theme);

  const [ seedLogData, setSeedLogData ] = useState(null);

  return (
    <React.Fragment>
      <Typography variant="h5">{ t('pages.bpmtool.title') }</Typography>
      
      <Card
        style={{ marginTop: theme.spacing(3) }}
        component="form"
        noValidate
        autoComplete="off"
      >
        <CardContent>
          <FormInput title="pages.bpmtool.seedLog.text">
            <FileUpload
              name="seedLog"
              accept=".log"
              onChange={ (evt) => {
                console.log('file upload seedlog change evt', evt)
              } }
            />
          </FormInput>

          <FormInput title="pages.bpmtool.caseVariability.text" style={{ marginTop: theme.spacing(2) }}>
            <FileUpload
              name="caseVariability"
              accept=".log"
              onChange={ (evt) => {
                console.log('file upload casevariability change evt', evt)
              } }
            />
          </FormInput>

          <FormInput title="pages.bpmtool.scenario.text" style={{ marginTop: theme.spacing(2) }}>
            <FileUpload
              name="scenario"
              accept=".log"
              onChange={ (evt) => {
                console.log('file upload scenario change evt', evt)
              } }
            />
          </FormInput>

          <FormInput 
            title="pages.bpmtool.logSize.text"
            helperText="pages.bpmtool.logSize.helperText"
            style={{ marginTop: theme.spacing(2) }}
          >
            <TextField variant="outlined" placeholder='10,25,50,100' />
          </FormInput>

          <FormInput 
            title="pages.bpmtool.families.text"
            style={{ marginTop: theme.spacing(2) }}
            titleAlignment="flex-start"
          >
            <InputGroup 
              repeatable={ true }
              fields={[
                {
                  name: 'title',
                  title: t('pages.bpmtool.families.title'),
                },
                {
                  name: 'balanced',
                  title: t('pages.bpmtool.families.balanced'),
                },
                {
                  name: 'imbalanced',
                  title: t('pages.bpmtool.families.imbalanced'),
                }
              ]}
            />
          </FormInput>

        </CardContent>
      </Card>

    </React.Fragment>
  )

};

export default BPMToolConfigurationPage;