import { Button } from '@components';
import { InputMsg, SendForm } from '.';

const MessageInput = () => {
  return (
    <SendForm>
      <InputMsg />
      <Button type="submit">보내기</Button>
    </SendForm>
  );
};

export default MessageInput;
