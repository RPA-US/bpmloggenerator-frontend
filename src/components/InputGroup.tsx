import React, { useState } from 'react';
import { Button, Grid, TextField } from '@mui/material';
import { styled } from '@mui/system';

interface Breakpoints {
  xs?: number,
  sm?: number,
  md?: number,
  lg?: number,
  xl?: number
}

interface FieldProps {
  name: string,
  title?: string
  renderInput?: Function,
  breakpoints?: Breakpoints,
}

export interface InputGroupProps {
  fields: FieldProps[],
  repeatable?: boolean,
}

interface SpacedGridItem {
  breakpoints: Breakpoints,
  defaultSpace: number,
}

const Spacer = styled('div')`
  flex-grow: 1;
`;

const AddButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(1),
}));

const ClearButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(1),
  marginRight: theme.spacing(2),
}))

const SpacedGridItem: React.FC<SpacedGridItem> = ({ breakpoints, defaultSpace, children }) => (
  <Grid item
    xs={ breakpoints.xs || 12 } 
    sm={ breakpoints.sm || defaultSpace }
    md={ breakpoints.md || defaultSpace }
    lg={ breakpoints.lg || defaultSpace }
    xl={ breakpoints.xl || defaultSpace }
  >
    { children }
  </Grid>
)

const InputGroup: React.FC<InputGroupProps> = ({ fields, repeatable }) => {
  const fieldsColumnSpaces = Math.floor(12 / fields.length);
  const titles = fields.length ? fields.map((field) => field.title) : []

  const [ rowNumbers, setRowNumbers ] = useState(1);

  const onChange = (rowNumber: number): React.ChangeEventHandler<HTMLInputElement> => (evt) => {
    console.log('InputGroup.onChange', rowNumber, evt);
  };

  const renderRow = (rowNumber: number) => (
    <React.Fragment>
      { fields.map((field, idx) => (
        <SpacedGridItem
          key={ idx }
          breakpoints={ field.breakpoints || {} }
          defaultSpace={ fieldsColumnSpaces }
        >
          { typeof field.renderInput === 'function'
            ? field.renderInput({ onChange: onChange(rowNumber) })
            : (<TextField variant="outlined" onChange={ onChange(rowNumber) } fullWidth />)
          }
        </SpacedGridItem>
      )) }
    </React.Fragment>
  );

  return (
    <Grid container justifyContent="space-between" spacing={1}>
      { titles.length && titles.map((title, idx) => (
        <SpacedGridItem
          key={ idx }
          breakpoints={ fields[idx]?.breakpoints || {} }
          defaultSpace={ fieldsColumnSpaces }
        >
          { title }
        </SpacedGridItem>
      )) }
      
      { fields.length && Array.from({ length: rowNumbers }, (_, rn) => renderRow(rn + 1))}

      { repeatable && (
        <Grid container>
          <Spacer />
          <Grid item>
            <ClearButton
              variant="contained"
              color="secondary"
              onClick={ () => setRowNumbers(rowNumbers - 1) }
            >
              { 'Del' }
            </ClearButton>
          </Grid>
          <Grid item>
            <AddButton
              variant="contained"
              color="secondary"
              onClick={ () => setRowNumbers(rowNumbers + 1) }
            >
              { 'Add' }
            </AddButton>
          </Grid>
        </Grid>
      ) }
    </Grid>
);
}

export default InputGroup;