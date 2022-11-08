class User {
  constructor(data) {
    this.data = data;
    console.log("userdata ",this.data)
  }

  serialize() {
    const x = {
      data: this.data,
    };

    if (this.oid) {
      console.log("user being seralized oid ", this.oid)
      x.oid = this.oid;
    }

    if (this.token) {
      console.log("user being seralized token ", this.token)
      x.token = this.token;
    }
    if (this.idtoken) {
      console.log("user being seralized idtoken ", this.idtoken)
      x.idtoken = this.idtoken;
    }

    return x;
  }

  static unserialize(obj) {
    const u = new User(obj.data);
    if (obj.token) {
      console.log("unseralized token ", obj.token)

      u.token = obj.token;
    }
    if (obj.idtoken) {
      console.log("unseralized idtoken ", obj.idtoken)

      u.idtoken = obj.idtoken;
    }

    if (obj.oid) {
      console.log("unseralized oid ", obj.oid)
      u.oid = obj.oid;
    }
    return u;
  }
}

export default User;
