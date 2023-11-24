import { useEffect, useState, useContext } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Socket } from 'socket.io-client';

import AudioOnIcon from '@assets/mic_on_icon.svg';
import AudioOffIcon from '@assets/mic_off_icon.svg';

import { alertAtom } from '@atoms/stateAtom';
import { userAtom } from '@atoms/userAtom';
import { palette } from '@utils/palette';
import { useAnimate } from '@hooks';
import { Button, Icon } from '@components';

import { getMedia } from '../helpers/connection';
import { Connection } from '../contexts';
import { Select } from '../components';

const CallContainer = () => {
  const navigate = useNavigate();

  const [animation, setAnimation] = useAnimate();
  const [_, setAlert] = useRecoilState(alertAtom);

  const userInfo = useRecoilValue(userAtom);

  const { socket } = useOutletContext<{ socket: Socket }>();

  const { name } = useParams();

  const { peerConnection, audioList, stream, audioRef } = useContext(Connection);

  const [selectedAudio, setSelectedAudio] = useState<MediaStreamTrack>();
  const [onAudio, setOnAudio] = useState(false);

  const [callState, setCallState] = useState('waiting');
  const [permit, setPermit] = useState(false);

  if (name !== userInfo.name && !permit && peerConnection.current) {
    socket.emit('permit_call', name, () => {
      setPermit(true);
    });
  }

  // select audio
  const handleChangeAudio = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();

    const value = e.target.value;
    const mediaStream = await getMedia({ audio: { deviceId: value } });

    setSelectedAudio(mediaStream.getTracks()[0]);

    const audioSender = peerConnection.current
      ?.getSenders()
      .find((sender) => sender.track?.kind === 'audio');

    await audioSender?.replaceTrack(mediaStream.getTracks()[0]);

    if (!onAudio)
      mediaStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });

    stream.current = mediaStream;
  };

  // mute or unmute
  const handleClickAudioToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    stream.current?.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setOnAudio(track.enabled);
    });
  };

  // close page
  const handleClickExit = (e: React.MouseEvent) => {
    e.preventDefault();
    setAnimation('fadeOut', () => {
      socket.emit('end_call', name, () => {
        peerConnection.current?.close();
        navigate(-1);
      });
    });
  };

  useEffect(() => {
    setSelectedAudio(stream.current?.getTracks()[0]);
    setOnAudio(true);
  }, [stream]);

  useEffect(() => {
    const permitCall = async () => {
      try {
        const offer = await peerConnection.current?.createOffer();
        await peerConnection.current?.setLocalDescription(offer);
        // send your offer (2)
        socket.emit('offer', name, offer, () => {
          setAlert({
            isOpened: true,
            type: 'success',
            children: '상대방과의 연결을 시작합니다.',
          });
        });
      } catch (err) {
        console.log(err);
      }
    };

    const receiveOffer = async (offer: RTCSessionDescription) => {
      try {
        await peerConnection.current?.setRemoteDescription(offer);
        const answer = await peerConnection.current?.createAnswer();
        await peerConnection.current?.setLocalDescription(answer);

        // send my answer (this name is roomname) (4)
        socket.emit('answer', name, answer, () => {
          setAlert({
            isOpened: true,
            type: 'success',
            children: '상대방과의 연결을 시작합니다.',
          });
          setCallState('connect');
        });
      } catch (err) {
        console.log(err);
      }
    };

    const receiveAnswer = async (answer: RTCSessionDescription) => {
      try {
        await peerConnection.current?.setRemoteDescription(answer);
        setCallState('connect');
      } catch (err) {
        console.log(err);
      }
    };

    const icecandidate = async (ice: RTCIceCandidateInit) => {
      try {
        await peerConnection.current?.addIceCandidate(ice);
      } catch (err) {
        console.log(err);
      }
    };

    const cancelCall = () => {
      socket.emit('end_call', name, () => {
        setAlert({
          isOpened: true,
          type: 'warning',
          children: '상대방이 통화를 거부하였습니다.',
        });
        setAnimation('fadeOut', () => {
          peerConnection.current?.close();
          navigate(-1);
        });
      });
    };

    const endCall = () => {
      setAlert({
        isOpened: true,
        type: 'warning',
        children: '상대방이 통화를 종료하였습니다.',
      });
      setAnimation('fadeOut', () => {
        peerConnection.current?.close();
        navigate(-1);
      });
    };

    // when partner permit your call (1)
    socket.on('permit_call', permitCall);

    // receive partner's offer (3)
    socket.on('offer', receiveOffer);

    // receive partner's answer (5)
    socket.on('answer', receiveAnswer);

    socket.on('icecandidate', icecandidate);

    // when partner reject your call
    socket.on('cancel_call', cancelCall);

    // when partner end call
    socket.on('end_call', endCall);

    return () => {
      socket.off('cancel_call', cancelCall);
      socket.off('permit_call', permitCall);
      socket.off('offer', receiveOffer);
      socket.off('answer', receiveAnswer);
      socket.off('icecandidate', icecandidate);
      socket.off('end_call', endCall);
    };
  }, [name, userInfo.name, socket, peerConnection, navigate, setAlert, setAnimation]);

  return (
    <div
      css={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
        animation: animation ? animation + '.2s forwards ease-out' : '',
      }}
    >
      <audio
        autoPlay
        playsInline
        controls={false}
        ref={audioRef}
        css={{
          display: 'none',
        }}
      />
      <div
        css={{
          position: 'absolute',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
        }}
      >
        {audioList.length ? (
          <div
            css={{
              padding: '16px 32px',
              background: callState === 'connect' ? palette.point.green : palette.point.red,
              color: palette.main.wht,
              fontSize: '16px',
              fontWeight: 700,
              userSelect: 'none',
            }}
          >
            {callState === 'connect' ? '통화중' : '연결중'}
          </div>
        ) : (
          <div
            css={{
              padding: '16px 32px',
              background: palette.point.yellow,
              color: palette.main.wht,
              fontSize: '16px',
              fontWeight: 700,
              userSelect: 'none',
            }}
          >
            마이크에 대한 접근이 필요합니다.
          </div>
        )}
      </div>
      <div
        css={{
          zIndex: 1000,
          position: 'fixed',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          bottom: 0,
          width: '100%',
          maxWidth: '390px',
          minWidth: '310px',
          boxSizing: 'border-box',
        }}
      >
        <Select
          defaultValue={selectedAudio?.id}
          option={audioList}
          onChange={handleChangeAudio}
        ></Select>

        <div css={{ display: 'flex', width: '100%' }}>
          <Button css={{ flex: 1 / 2 }} onClick={handleClickAudioToggle}>
            <Icon src={onAudio ? AudioOnIcon : AudioOffIcon}></Icon>
          </Button>
          <Button css={{ flex: 1 / 2 }} color="secondary" onClick={handleClickExit}>
            나가기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CallContainer;
