interface Serializable<T> {
  deserialize (obj: any): T
}

export { Serializable }
