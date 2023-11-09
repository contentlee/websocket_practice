import { useNavigate, useOutletContext, useParams } from 'react-router';
import { useEffect, useState, useContext } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Socket } from 'socket.io-client';

import AudioOnIcon from '@assets/mic_on_icon.svg';
import AudioOffIcon from '@assets/mic_off_icon.svg';
import VideoOnIcon from '@assets/videocam_on_icon.svg';
import VideoOffIcon from '@assets/videocam_off_icon.svg';

import { alertAtom } from '@atoms/stateAtom';
import { userAtom } from '@atoms/userAtom';
import { useAnimate } from '@hooks';
import { Button, Icon } from '@components';

import { getMedia } from '../helpers/connection';
import { Connection } from '../contexts';
import { Select } from '../components';

const VideoContainer = () => {
  const navigate = useNavigate();

  const [animation, setAnimation] = useAnimate();
  const [_, setAlert] = useRecoilState(alertAtom);

  const userInfo = useRecoilValue(userAtom);

  const { socket } = useOutletContext<{ socket: Socket }>();

  const { name } = useParams();

  const { peerConnection, stream, audioList, myVideoRef, peerVideoRef, videoList } =
    useContext(Connection);

  const [selectedAudio, setSelectedAudio] = useState<MediaStreamTrack>();
  const [onAudio, setOnAudio] = useState(false);

  const [selectedVideo, setSelectedVideo] = useState<MediaStreamTrack>();
  const [onVideo, setOnVideo] = useState(false);

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
    const mediaStream = await getMedia({
      audio: { deviceId: value },
      video: { deviceId: selectedVideo?.getConstraints().deviceId },
    });

    if (myVideoRef.current) myVideoRef.current.srcObject = mediaStream;
    setSelectedAudio(mediaStream.getAudioTracks()[0]);

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

  // select video
  const handleChangeVideo = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();

    const value = e.target.value;
    const mediaStream = await getMedia({
      video: { deviceId: value },
      audio: { deviceId: selectedAudio?.getConstraints().deviceId },
    });

    if (myVideoRef.current) myVideoRef.current.srcObject = mediaStream;
    setSelectedVideo(mediaStream.getVideoTracks()[0]);

    const videoSender = peerConnection.current
      ?.getSenders()
      .find((sender) => sender.track?.kind === 'video');
    await videoSender?.replaceTrack(mediaStream.getVideoTracks()[0]);

    if (!onVideo)
      mediaStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });

    if (!onAudio)
      mediaStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });

    stream.current = mediaStream;
  };

  // turnOn or turnOff
  const handleClickVideoToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (myVideoRef.current?.srcObject) {
      (myVideoRef.current.srcObject as MediaStream).getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
        setOnVideo(track.enabled);
      });
    }
    stream.current?.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setOnVideo(track.enabled);
    });
  };

  // close page
  const handleClickExit = (e: React.MouseEvent) => {
    e.preventDefault();
    setAnimation({
      type: 'fadeOut',
      callback: () => {
        socket.emit('end_call', name, () => {
          peerConnection.current?.close();
          navigate(-1);
        });
      },
    });
  };

  useEffect(() => {
    setSelectedAudio(stream.current?.getAudioTracks()[0]);
    setOnAudio(true);
    setSelectedVideo(stream.current?.getVideoTracks()[0]);
    setOnVideo(true);
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
        });
      } catch (err) {
        console.log(err);
      }
    };

    const receiveAnswer = async (answer: RTCSessionDescription) => {
      try {
        await peerConnection.current?.setRemoteDescription(answer);
        setCallState('connect');
        console.log(callState);
      } catch (err) {
        console.log(err);
      }
    };

    const icecandidate = async (ice: RTCIceCandidateInit) => {
      try {
        if (peerConnection.current?.getReceivers())
          await peerConnection.current?.addIceCandidate(ice);
      } catch (err) {
        console.log(err);
      }
    };

    const cancelCall = () => {
      socket.emit('end_call', name, () => {
        setAnimation({
          type: 'fadeOut',
          callback: () => {
            peerConnection.current?.close();
            navigate(-1);
          },
        });
      });
    };

    const endCall = () => {
      setAlert({
        isOpened: true,
        type: 'warning',
        children: '상대방이 통화를 종료하였습니다.',
      });
      setAnimation({
        type: 'fadeOut',
        callback: () => {
          peerConnection.current?.close();
          navigate(-1);
        },
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
      <div
        css={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          marginBottom: '126px',
        }}
      >
        <video
          muted
          autoPlay
          playsInline
          controls={false}
          ref={peerVideoRef}
          css={{
            width: '100%',
            height: '100%',
          }}
        />
        <video
          muted
          autoPlay
          playsInline
          controls={false}
          ref={myVideoRef}
          css={{
            width: '100%',
            height: '100%',
          }}
        />
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
          defaultValue={selectedVideo?.id}
          option={videoList}
          onChange={handleChangeVideo}
        ></Select>
        <Select
          defaultValue={selectedAudio?.id}
          option={audioList}
          onChange={handleChangeAudio}
        ></Select>

        <div css={{ display: 'flex', width: '100%' }}>
          <Button css={{ flex: 1 / 3 }} onClick={handleClickVideoToggle}>
            <Icon src={onVideo ? VideoOnIcon : VideoOffIcon}></Icon>
          </Button>
          <Button css={{ flex: 1 / 3 }} onClick={handleClickAudioToggle}>
            <Icon src={onAudio ? AudioOnIcon : AudioOffIcon}></Icon>
          </Button>
          <Button css={{ flex: 1 / 3 }} color="secondary" onClick={handleClickExit}>
            나가기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoContainer;
