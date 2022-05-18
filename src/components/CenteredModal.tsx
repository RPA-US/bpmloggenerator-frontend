import React from 'react';
import { Card, CardActions, CardContent, IconButton, styled } from '@mui/material';
import { Box, Modal } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export interface CenteredModalProps {
  opened: boolean
  onClose?: Function
  titleId?: string
  actions?: React.ReactNode
}

const StyledModalContainer = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  maxWidth: '100%'
}))

const CenteredModal: React.FC<CenteredModalProps> = ({ opened, onClose, titleId, children, actions }) => (
  <Modal
    open={opened}
    onClose={ () => onClose != null && onClose() }
    aria-labelledby={ titleId }
  >
    <StyledModalContainer>
      <Card style={{ position: 'relative'}}>
        <IconButton
          style={{ 
            position: 'absolute',
            top: '13px',
            right: '4px'
          }}
          onClick={ () => onClose != null && onClose() }
        >
          <CloseIcon></CloseIcon>
        </IconButton>
        <CardContent>
          { children }
        </CardContent>
        
        { actions != null && (
          <CardActions>
            { actions }
          </CardActions>
        ) }
      </Card>
    </StyledModalContainer>
  </Modal>
)

export default CenteredModal;