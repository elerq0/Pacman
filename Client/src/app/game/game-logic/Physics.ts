import { Map } from "./Map";
import { Unit } from "./Unit";
import { Interface } from "./Interface";


export class Physics {

    map: Map;
    unit: Unit;
    interface: Interface

    constructor(map, unit, interf) {
        this.map = map
        this.unit = unit
        this.interface = interf
    }


    move(object, dist) {
        switch (object.currentPath) {
            case 'left':
                if (this.canGoLeft(object))
                    object.x -= dist
                break;
            case 'up':
                if (this.canGoUp(object))
                    object.y -= dist
                break;
            case 'right':
                if (this.canGoRight(object))
                    object.x += dist
                break;
            case 'down':
                if (this.canGoDown(object))
                    object.y += dist
                break;
        }
        if (object.x < this.map.horizontalShift)
            object.x = this.map.horizontalShift + this.map.blockSize * this.map.gridX;
        else if (object.x > this.map.horizontalShift + this.map.blockSize * this.map.gridX)
            object.x = this.map.horizontalShift;
    }

    backMove(object, dist) {
        switch (object.currentPath) {
            case 'left':
                object.x += dist
                break;
            case 'up':
                object.y += dist
                break;
            case 'right':
                object.x -= dist
                break;
            case 'down':
                object.y -= dist
                break;
        }
    }

    collision(r1, r2) {

        let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

        hit = false;

        r1.centerX = r1.x + r1.width / 2;
        r1.centerY = r1.y + r1.height / 2;
        r2.centerX = r2.x + r2.width / 2;
        r2.centerY = r2.y + r2.height / 2;

        r1.halfWidth = r1.width / 2;
        r1.halfHeight = r1.height / 2;
        r2.halfWidth = r2.width / 2;
        r2.halfHeight = r2.height / 2;

        vx = r1.centerX - r2.centerX;
        vy = r1.centerY - r2.centerY;

        combinedHalfWidths = r1.halfWidth + r2.halfWidth;
        combinedHalfHeights = r1.halfHeight + r2.halfHeight;

        if (Math.abs(vx) < combinedHalfWidths) {

            if (Math.abs(vy) < combinedHalfHeights) {

                hit = true;
            } else {
                hit = false;
            }
        } else {

            hit = false;
        }
        return hit;
    };




    canGoUp(object) {
        for (let W of this.map.walls) {
            if (W.x <= object.x + W.width && W.x > object.x - W.width * 2 && W.y <= object.y) {
                if (this.collision(W, object)) {
                    return false;
                }
            }
        }
        return true;
    }

    canGoDown(object) {
        for (let W of this.map.walls) {
            if (W.y >= object.y) {
                if (W.x <= object.x + W.width && W.x > object.x - W.width * 2 && this.collision(W, object)) {
                    return false;
                }
            }
        }
        return true;
    }

    canGoLeft(object) {
        for (let W of this.map.walls) {
            if (W.x <= object.x) {
                if (W.y <= object.y + W.height && W.y > object.y - W.height * 2 && this.collision(W, object)) {
                    return false;
                }
            }
        }
        return true;
    }

    canGoRight(object) {
        for (let W of this.map.walls) {
            if (W.y <= object.y + W.height && W.y > object.y - W.height * 2 && W.x >= object.x) {
                if (this.collision(W, object)) {
                    return false;
                }
            }
        }
        return true;
    }

    canGoForward(object) {
        switch (object.currentPath) {
            case 'left':
                return this.canGoLeft(object)
            case 'up':
                return this.canGoUp(object)
            case 'right':
                return this.canGoRight(object)
            case 'down':
                return this.canGoDown(object)
            case 'none':
                return false;
        }
    }

    turnBackward(object) {
        switch (object.currentPath) {
            case 'left':
                object.currentPath = 'right'
                break;
            case 'up':
                object.currentPath = 'down'
                break;
            case 'right':
                object.currentPath = 'left'
                break;
            case 'down':
                object.currentPath = 'up'
                break;
        }
    }


    canTurnLeft(object) {
        switch (object.currentPath) {
            case 'left':
                return this.canGoDown(object)
            case 'up':
                return this.canGoLeft(object)
            case 'right':
                return this.canGoUp(object)
            case 'down':
                return this.canGoRight(object)
            case 'none':
                return false;
        }
    }

    turnLeft(object) {
        switch (object.currentPath) {
            case 'left':
                object.currentPath = 'down'
                break;
            case 'up':
                object.currentPath = 'left'
                break;
            case 'right':
                object.currentPath = 'up'
                break;
            case 'down':
                object.currentPath = 'right'
                break;
        }
    }

    canTurnRight(object) {
        switch (object.currentPath) {
            case 'left':
                return this.canGoUp(object)
            case 'up':
                return this.canGoRight(object)
            case 'right':
                return this.canGoDown(object)
            case 'down':
                return this.canGoLeft(object)
            case 'none':
                return false;
        }
    }

    turnRight(object) {
        switch (object.currentPath) {
            case 'left':
                object.currentPath = 'up'
                break;
            case 'up':
                object.currentPath = 'right'
                break;
            case 'right':
                object.currentPath = 'down'
                break;
            case 'down':
                object.currentPath = 'left'
                break;
        }
    }


}