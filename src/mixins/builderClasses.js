// Classes whose sole purpose is to "build" objects for later usage
// Just a way to consistently create "like" objects

class CleanString {
    constructor(str) {
        this.str = str;
        this.clean();
    }
    // clean
    // Removes unnecessary parts of a track name (that aren't relevant to the name of the track itself)
    // - Anything included inside parentheses or brackets
    // - The "feat./ft."
    // - Quotation marks
    // - Dashes
    clean() {
        this.removeSubstr("(", ")")
        .removeSubstr("[", "]")
        .removeSubstr("{", "}")
        this.str = this.str
        .replace("\"", "")
        .replace("- ", "")
        .replace("  ", " ")
        .replace("topic", "")
        .toLowerCase()
        .trim();
        return this;
    }
    // removeSubstr : String Char -> ...
    // Removes a substring from _str_ from the given _openChar_ to _closeChar_
    removeSubstr(openChar, closeChar) {
        const start = this.str.indexOf(openChar);
        const end = this.str.indexOf(closeChar);
        if (start !== -1 && end !== -1) {
          const substr = this.str.substring(start, end+1);
          this.str = this.str.replace(substr, "");
        }
        return this;
    }

    removeFeatures() {
        const index1 = this.str.indexOf("feat");
        const index2 = this.str.indexOf("ft.");

        if (index1 !== -1) {
            this.str = this.str.substring(0, index1-1);
        } else if (index2 !== -1) {
            this.str = this.str.substring(0, index2-1);
        }
        return this;
    }
}

class Account {
    constructor(playlists, platform, token, { name, id }) {
        this.platform = platform;
        this.token = token;
        this.name = name;
        this.id = id;
        this.playlists = playlists;
        this.dateAdded = Date.now();
    }
}


class Playlist {
    constructor(id, name, platform, { numTracks, url, liked }) {
        this.id = id;
        this.name = name;
        this.platform = platform;
        this.selected = false;
        this.numTracks = numTracks;
        this.url = url;
        this.liked = liked;
        this.tracks = [];
    }
}

class Track {
    constructor(name, platform, artists, {uri, resourceId}) {
        this.name = name;
        this.platform = platform;
        // A [List-of String] that contains strings that are LIKELY representative of the artists:
        // - The artist on the track
        // - Any features on the track
        this.artists = artists;
        this.uri = uri;
        this.resourceId = resourceId;
    }

}

export {CleanString, Account, Playlist, Track};
