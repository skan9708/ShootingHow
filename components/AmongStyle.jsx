import styled from "styled-components";

// Container 컴포넌트
export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

// Title 컴포넌트
export const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #333;
`;

// Card 컴포넌트
export const Card = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

// SlideCards 컴포넌트
export const SlideCards = styled.div`
  display: flex;
  gap: 20px;
  overflow-x: auto;
`;

// ImageContent 컴포넌트
export const ImageContent = styled.div`
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 55%;
  background-image: ${props => props.image ? `url(${props.image})` : 'none'};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 8px;
  overflow: hidden;
`;

// Center 컴포넌트
export const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

// Section 컴포넌트
export const Section = styled.section`
  padding: 40px 0;
`;

// Sections 컴포넌트
export const Sections = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

// Button 컴포넌트
export const Button = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  
  &:hover {
    background: #0056b3;
  }
`;

// Right 컴포넌트
export const Right = styled.div`
  text-align: right;
`;

// StyledPagination 컴포넌트
export const StyledPagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin: 20px 0;
`;

// Computer (데스크톱용) 컴포넌트
export const Computer = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`;

// Mobile (모바일용) 컴포넌트
export const Mobile = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

// 추가 컴포넌트들
export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
`;

export const TextArea = styled.textarea`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  min-height: 100px;
  resize: vertical;
`;

export const Label = styled.label`
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
`;

export const Flex = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

// Description 컴포넌트
export const Description = styled.div`
  font-size: 16px;
  line-height: 1.6;
  color: #666;
  margin-bottom: 15px;
  
  .desc {
    margin-bottom: 20px;
    line-height: 1.6;
  }
  
  .box {
    background:rgb(255, 255, 255);
    padding: 20px;
    border-radius: 8px;
    
    .title {
      font-weight: bold;
      color: #07287C;
      margin-top: 15px;
      margin-bottom: 5px;
      
      &:first-child {
        margin-top: 0;
      }
    }
    
    .desc {
      color: #666;
      margin-bottom: 10px;
    }
  }
`;

// InfoBox 컴포넌트
export const InfoBox = styled.div`
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
  margin: 15px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  .form_title {
    font-weight: bold;
    color: #07287C;
    font-size: 18px;
    margin-bottom: 8px;
  }
  
  .form_desc {
    color: #666;
    font-size: 14px;
    margin-bottom: 15px;
  }
  
  .form_info {
    .form_check {
      margin-top: 10px;
      font-size: 14px;
      color: #666;
      
      input[type="checkbox"] {
        margin-right: 8px;
      }
    }
  }
  
  .forms {
    .form_input {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      
      .label {
        min-width: 80px;
        font-weight: 500;
        color: #333;
        margin-right: 15px;
      }
      
      .input {
        display: flex;
        align-items: center;
        flex: 1;
        
        input {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          
          &:focus {
            outline: none;
            border-color: #07287C;
          }
        }
        
        > div {
          margin-left: 8px;
          color: #666;
        }
      }
    }
  }
`;

// WarningBox 컴포넌트
export const WarningBox = styled.div`
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  padding: 15px;
  margin: 15px 0;
  color: #856404;
  
  .title {
    font-weight: bold;
    margin-bottom: 8px;
  }
  
  .content {
    line-height: 1.5;
  }
`; 