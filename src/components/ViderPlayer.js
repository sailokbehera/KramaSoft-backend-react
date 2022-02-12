// import React, { useEffect, useRef } from 'react';
// import Plyr from 'plyr';
// import PropTypes from 'prop-types';
// import 'plyr/dist/plyr.css';
//
// const VideoPlayer = ({ type, provider, src }) => {
//     const ref = useRef();
//
//     useEffect(() => {
//         if (ref.current && src) {
//             const player = new Plyr(ref.current, { settings: ['captions', 'quality', 'speed', 'loop'] });
//             player.source = {
//                 //type: 'audio' , 'video'
//                 type: type,
//                 // title: 'Example Title',
//                 sources: [
//                     {
//                         src: src,
//                         //provider: 'html5' , 'youtube'
//                         provider: provider,
//                     },
//                 ],
//                 // poster: '',
//                 // previewThumbnails: {
//                 //     src: '',
//                 // },
//                 // tracks: [
//                 //     {
//                 //         kind: 'captions',
//                 //         label: 'English',
//                 //         srclang: 'en',
//                 //         src: '/path/to/captions.en.vtt',
//                 //         default: true,
//                 //     },
//                 //     {
//                 //         kind: 'captions',
//                 //         label: 'French',
//                 //         srclang: 'fr',
//                 //         src: '/path/to/captions.fr.vtt',
//                 //     },
//                 // ],
//             };
//         }
//     }, [ref.current, src]);
//
//     return <video controls ref={ref} />;
// };
//
// VideoPlayer.propTypes = {
//     type: PropTypes.oneOf(['audio', 'video']),
//     provider: PropTypes.oneOf(['html5', 'youtube']),
//     src: PropTypes.string.isRequired,
// };
//
// VideoPlayer.defaultProps = {
//     type: 'video',
//     provider: 'html5',
// };
//
// export default VideoPlayer;
import React, { useEffect, useRef } from 'react';

import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
// import ShakaPlayer from 'shaka-player-react';

const ShakaPlayer = dynamic(() => import('shaka-player-react'), { ssr: false });

const VideoPlayer = ({ src }) => {
    const ref = useRef();

    useEffect(() => {
        // if (ref.current && src) {
        //     const player = new Plyr(ref.current, { settings: ['captions', 'quality', 'speed', 'loop'] });
        //     player.source = {
        //         type: type,
        //         sources: [
        //             {
        //                 src: src,
        //                 //provider: 'html5' , 'youtube'
        //                 provider: provider,
        //             },
        //         ],
        //     };
        // }
    }, [ref.current, src]);

    // return <video id="myMainVideoPlayer" controls ref={ref} />;

    return <ShakaPlayer autoPlay src={src} />;
};

VideoPlayer.propTypes = {
    type: PropTypes.any,
    provider: PropTypes.any,
    src: PropTypes.any,
};

export default VideoPlayer;
