'use strict';
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
exports.MessageForm = exports.Message = exports.MessageBox = exports.ChatContainer = void 0;
const styled_1 = __importDefault(require('@emotion/styled'));
const ChatContainer = styled_1.default.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #000;
  padding: 1rem;


  min-height: 360px;
  max-height: 600px;
  overflow: auto;


  background: #b2c7d9;
`;
exports.ChatContainer = ChatContainer;
const MessageBox = styled_1.default.div`
  display: flex;
  flex-direction: column;


  &.my_message {
    align-self: flex-end;


    .message {
      background: yellow;
      align-self: flex-end;
    }
  }


  &.alarm {
    align-self: center;
  }
`;
exports.MessageBox = MessageBox;
const Message = styled_1.default.span`
  margin-bottom: 0.5rem;
  background: #fff;
  width: fit-content;
  padding: 12px;
  border-radius: 0.5rem;
`;
exports.Message = Message;
const MessageForm = styled_1.default.form`
  display: flex;
  margin-top: 24px;


  input {
    flex-grow: 1;
    margin-right: 1rem;
  }
`;
exports.MessageForm = MessageForm;
