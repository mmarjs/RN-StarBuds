import { Colors } from "./../../theme";

export const CameraViewStyle = {
  container: {
    flex: 1
    // backgroundColor: 'red'
  },
  preview: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  preview1: {
    flex: 1,
    justifyContent: "flex-end"
    // alignItems: 'center',
  },
  header: {
    height: 50,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 10
  },
  cancleBtn: {
    padding: 20
  },
  doneBtn: {
    padding: 20
  },
  closeImage: {
    height: 30,
    width: 30
  },
  imageView: {
    paddingTop: 15
  },
  image: {
    height: 500,
    width: null
  },
  doneText: {
    position: "absolute",
    right: 10
  },
  bottomOverlay: {
    position: "absolute",
    right: 0,
    left: 0,
    alignItems: "center",
    bottom: 0,
    flexDirection: "column",
    alignItems: "stretch"
  },
  frontCameraOverlay: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  buttonOverlay: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
    justifyContent: "center"
  },
  timerProgressContainer: {
    flex: 0.5,
    alignItems: "center",
    justifyContent: "center"
  },
  captureButton: {
    // paddingLeft: 15,
    // paddingRight: 15,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 99
  },
  captureButtonInside: {
    height: 80,
    width: 80,
    borderRadius: 40,
    borderWidth: 6,
    borderColor: "rgba(37,37,37,0.57)",
    backgroundColor: "rgb(0,0,0)"
  },
  captureButtonInsideVideo: {
    backgroundColor: "#800000"
  },
  captureButtonInsideCamera: {
    borderColor: "rgba(37,37,37,0.57)"
  },
  typeButton: {
    padding: 5
  },
  flashButton: {
    padding: 5
  },
  closeBtn: {
    height: 25,
    width: 25
  },
  outerCircle: {
    backgroundColor: "#ddd",
    height: 80,
    width: 80,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#ccc"
  },
  innerCircle: {
    backgroundColor: "#fff",
    height: 50,
    width: 50,
    borderRadius: 50,
    margin: 14
  },
  recOuterCircle: {
    backgroundColor: "#ddd",
    height: 80,
    width: 80,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#918b8b"
  },
  recInnerCircle: {
    backgroundColor: "#e54242",
    height: 70,
    width: 70,
    borderRadius: 50,
    margin: 4
  },
  previewImage: {
    backgroundColor: "red"
  },
  timerStyle: {
    fontSize: 14,
    color: "#000"
    // container: {
    //   backgroundColor: '#000',
    //   padding: 5,
    //   width: 220,
    // 	alignItems:'center',
    // },
    // text: {
    //   fontSize: 14,
    //   color: '#FFF',
    // }
  },
  captureView: {
    flex: 0.5,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  playBtn: {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    zIndex: 100
  },
  progress: {
    margin: 10
  },
  textStyle: {
    fontSize: 16,
    color: Colors.white,
    textAlign: "center",
    lineHeight: 21,
    letterSpacing: 0.8,
    paddingLeft: 25,
    paddingRight: 25,
    marginTop: 30,
    fontFamily: "ProximaNova-Light"
  },
  headerRightText: {
    color: Colors.warmGrey,
    marginLeft: 10,
    fontFamily: "SourceSansPro-Regular",
    fontSize: 18,
    // letterSpacing: 0.8
  },
  playButton: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center"
  },
  headerRightTextActive: {
    color: Colors.primary,
    marginLeft: 10,
    fontFamily: "SourceSansPro-Regular",
    fontSize: 18,
    // letterSpacing: 0.8
  }
};
