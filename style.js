import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6F0FF",
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  container2: {
    flex: 1,
    backgroundColor: "#B3D1FF",
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  titleTxt: {
    backgroundColor: "#4287f5",
    fontSize: 24,
    padding: 16,
    textAlign: "center",
    fontWeight: "bold",
    color: "black",
  },
  contentWr: {
    flex: 1,
    backgroundColor: "#fff",
  },
  wmb: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  flex1: {
    flex: 1,
  },
  padding16: {
    padding: 16,
  },
  btn1: {
    fontSize: 18,
    color: "#4287f5",
  },
  textInput: {
    backgroundColor: "#f5f5f5",
    flex: 1,
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    color: "#333",
  },
  pos: {
    position: "absolute",
    right: 30,
    bottom: 30,
    zIndex: 999,
  },
  sun: {
    width: 100,
    height: 100,
    backgroundColor: "#4287f5",
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  txtWhite: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
  renderView: {
    padding: 20,
    borderBottomColor: "#B3D1FF",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  memoContent: {
    flex: 1,
  },
  buttons: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  editButton: {
    backgroundColor: "#4287f5",
  },
  deleteButton: {
    backgroundColor: "#f54242",
  },
  btnText: {
    color: "white",
    fontWeight: "bold",
  },
  searchContainer: {
    marginBottom: 10,
  },
  searchInput: {
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  emotionContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  emotionButton: {
    backgroundColor: "#ccc",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedEmotion: {
    backgroundColor: "#4287f5",
  },
  emotionButtonText: {
    fontSize: 20,
  },
  infoContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 20,
    borderRadius: 8,
  }
});

export default styles;
