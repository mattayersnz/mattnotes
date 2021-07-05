import React from 'react';
import styled from "styled-components";
import star from '../images/star.svg';
import question from '../images/question.svg';
import {Indicator} from '../globalstyles/Indicator';
// import { CheckNoteBlocksUL } from './Store'

// Paragraph inline elements
export const Paragraph = props => {
  return (
    <StyledParagraph {...props.attributes}>
      {props.children}
    </StyledParagraph>
  )
}

const StyledParagraph = styled.span`
  font-family: 'Rubik', 'sans serif';
  font-size: 1rem;
  color: #EBEBEB;
  display: block;
  padding-bottom: 7px;
`

// H1 block elements
export const TitleElement = props => {
  return (
    <StyledTitle {...props.attributes}>
      {props.children}
    </StyledTitle>
  )
}

const StyledTitle = styled.span`
  font-family: 'Rubik', 'sans serif';
  font-size: 3rem;
  font-weight: 600;
  color: #EBEBEB;
  display: block;
  padding-bottom: 21px;
`

// Star elements
export const StarElement = ({ attributes, children }) => {
  return (
    <div>
      <StyledStarElement {...attributes}>
        <StyledStarImgElementContainer contentEditable={false}>
          <StyledStarImgElement
            src={star}
          />
        </StyledStarImgElementContainer>
        {children}
      </StyledStarElement>
    </div>
  )
}

const StyledStarImgElementContainer = styled.div`
display: inline-block;
`

const StyledStarImgElement = styled.img`
width: 14px;
padding-right: 7px;
`

const StyledStarElement = styled.span`
font-family: 'Rubik', 'sans serif';
font-size: 1rem;
color: #EBEBEB;
padding-bottom: 7px;
`

// OrderedListItem block element
export const OrderedListItem = props => {
  return (
    <StyledOrderedListItem>
      <ol>
        <li>{props.children}</li>
      </ol>
    </StyledOrderedListItem>
  )
}

const StyledOrderedListItem = styled.span`
  font-family: 'Rubik', 'sans serif';
  font-size: 1rem;
  color: #EBEBEB;
  display: block;
`

// DottedListItem block element
export const DottedListItem = props => {
  return (
    <StyledDottedListItem>
      <ul>
        <li>{props.children}</li>
      </ul>
    </StyledDottedListItem>
  )
}

const StyledDottedListItem = styled.span`
  font-family: 'Rubik', 'sans serif';
  font-size: 1rem;
  color: #EBEBEB;
  display: block;
`

// Leaf: Link, Bold
export const Leaf = props => {
  
    if (props.leaf.link) {
      const linkType = Indicator[4];
      return (
          <PageLink {...props.attributes} indicator={linkType}>
              {props.children}
          </PageLink>
      )
    }
    return (
      <span {...props.attributes} style={{fontWeight: props.leaf.bold ? 'bold' : ''}}>
          {props.children}
      </span>
    );
};

// Page links with indicators
const PageLink = styled.span`
  background: ${(props) => props.indicator};
  border-radius: 3px;
  padding: 1px 3px 1px 3px;
  font-family: 'Rubik', 'sans serif';
  font-size: 1rem;
  color: #EBEBEB;
`

// const PageLinkWithULs = styled.span`
//   background: #FF4F47;
//   border-radius: 3px;
//   padding: 1px 3px 1px 3px;
//   font-family: 'Rubik', 'sans serif';
//   font-size: 1rem;
//   color: #EBEBEB;
// `

// Question Block
export const QuestionBlock = ({ attributes, children }) => {
  return (
    <div>
      <StyledQuestionBlock {...attributes}>
        <StyledQuestionBlockContainer contentEditable={false}>
          <StyledQuestionImg
            src={question}
          />
        </StyledQuestionBlockContainer>
        {children}
      </StyledQuestionBlock>
    </div>
  )
}

const StyledQuestionBlockContainer = styled.div`
display: inline-block;
`

const StyledQuestionImg = styled.img`
width: 12px;
padding-right: 8px;
padding-left: 2px;
`

const StyledQuestionBlock = styled.span`
font-family: 'Rubik', 'sans serif';
font-size: 1rem;
color: #EBEBEB;
padding-bottom: 7px;
`