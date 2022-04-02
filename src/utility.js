class Utility {
  constructor(object) {
    this.object = object;
  }
  handleCheck(id) {
    this.id = id;
    var newArr = this.object;
    for (var i = 0; i < this.object.length; i++) {
      if (this.object[i].id === this.id) {
        newArr[i].completed = !newArr[i].completed;
      }
    }
    return newArr;
  }
  handleSubmit(val) {
    this.val = val;
    var newArr = [{ id: 5, title: this.val, completed: false }, ...this.object];
    return newArr;
  }
}
export default Utility;
