import {Config} from '@remotion/cli/config';

// JPEG de haute qualité pour les images intermédiaires, puis H.264 propre.
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setCodec('h264');
Config.setCrf(16);
Config.setPixelFormat('yuv420p');
Config.setOverwriteOutput(true);
