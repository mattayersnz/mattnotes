import React from 'react';
import styled from "styled-components";
import star from '../images/star.svg';
import question from '../images/question.svg';
import property from '../images/property.svg';
import { Colours } from '../globalstyles/Colours';


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
  color: ${Colours.font.light};
  display: block;
  margin-bottom: 7px;
  line-height: 1.5;
`

// Title block elements
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
  color: ${Colours.font.light};
  display: block;
  padding-bottom: 32px;
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
margin-bottom: 7px;
`

const StyledStarImgElement = styled.img`
width: 14px;
padding-right: 7px;
`

const StyledStarElement = styled.span`
font-family: 'Rubik', 'sans serif';
font-size: 1rem;
color: ${Colours.font.light};
margin-bottom: 7px;
line-height: 1.5;
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
  color: ${Colours.font.light};
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
  color: ${Colours.font.light};
  display: block;
`

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
margin-bottom: 7px;
`

const StyledQuestionImg = styled.img`
width: 12px;
padding-right: 8px;
padding-left: 2px;
`

const StyledQuestionBlock = styled.span`
font-family: 'Rubik', 'sans serif';
font-size: 1rem;
color: ${Colours.font.light};
margin-bottom: 7px;
line-height: 1.5;
`

// Property Block
export const PropertyBlock = ({ attributes, children }) => {
  return (
    <div>
      <StyledPropertyBlock {...attributes}>
        <StyledPropertyBlockContainer contentEditable={false}>
          <StyledPropertyImg
            src={property}
          />
        </StyledPropertyBlockContainer>
        {children}
      </StyledPropertyBlock>
    </div>
  )
}

const StyledPropertyBlockContainer = styled.div`
display: inline-block;
margin-bottom: 7px;
`

const StyledPropertyImg = styled.img`
width: 8px;
padding-right: 8px;
padding-left: 2px;
`

const StyledPropertyBlock = styled.span`
font-family: 'Rubik', 'sans serif';
font-size: 1rem;
color: ${Colours.font.light};
margin-bottom: 7px;
line-height: 1.5;
`

const getNoteMeta = (noteId, notesMeta) => {
  var meta = notesMeta && notesMeta.find(note => note._id === noteId);
  return meta;
}

const getQuestionCountFromMeta = (noteId, notesMeta) => {
  const meta = getNoteMeta(noteId, notesMeta);
  return meta && Number.isInteger(meta.questionCount) ? meta.questionCount : null;
}

// Leaf: Link, Bold
export const Leaf = props => {
    if (props.leaf.type === 'link') {
      const questionCount = getQuestionCountFromMeta(props.leaf.linkNoteId, props.notesMeta);
      // indicator colour
      const linkType = questionCount === null ? Colours.deleted : Colours.indicator[questionCount];

      return (
          <PageLink {...props.attributes} indicator={linkType}>
              {props.children}
          </PageLink>
      )
    }

    if (props.leaf.underline) {
      return (
        <span {...props.attributes} style={{textDecoration: props.leaf.underline ? 'underline' : ''}}>
            {props.children}
        </span>
      );
    }

    if (props.leaf.italic) {
      return (
        <span {...props.attributes} style={{fontStyle: props.leaf.italic ? 'italic' : ''}}>
            {props.children}
        </span>
      );
    }

    if (props.leaf.strikethrough) {
      return (
        <span {...props.attributes} style={{textDecoration: props.leaf.strikethrough ? 'line-through' : ''}}>
            {props.children}
        </span>
      );
    }

    if (props.leaf.bold) {
      return (
        <span {...props.attributes} style={{fontWeight: props.leaf.bold ? 'bold' : ''}}>
            {props.children}
        </span>
      );
    }

    return (
      <span {...props.attributes}>
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
  color: ${Colours.font.light};
`
