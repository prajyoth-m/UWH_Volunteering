export class EventLocation {
  lat: string;
  long: string;

  public get getLat(): string {
    return this.lat;
  }
  public get getLong(): string {
    return this.long;
  }
  public set setLat(value: string) {
    this.lat = value;
  }
  public set setLong(value: string) {
    this.long = value;
  }
}
