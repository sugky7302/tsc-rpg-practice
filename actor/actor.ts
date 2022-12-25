export default abstract class Actor {
    protected abstract len: number;
    protected abstract width: number;
    protected abstract height: number;

    get volume(): number {
        return this.len * this.width * this.height;
    }
}
