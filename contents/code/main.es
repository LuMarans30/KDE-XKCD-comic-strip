/*
 *   Copyright (C) 2007 Tobias Koenig <tokoe@kde.org>
 *   Copyright (C) 2009 - 2017 Matthias Fuchs <mat69@gmx.net>
 *   Copyright (C) 2019 Hans-Peter Jansen <hpj@urpla.net>
 *   Copyright (C) 2021 Mike Vastola <mike@vasto.la>
 *
 *   This program is free software; you can redistribute it and/or modify
 *   it under the terms of the GNU Library General Public License version 2 as
 *   published by the Free Software Foundation
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details
 *
 *   You should have received a copy of the GNU Library General Public
 *   License along with this program; if not, write to the
 *   Free Software Foundation, Inc.,
 *   51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */

// XKCD Comic Provider Plugin

init = () => {
    comic.comicAuthor = "Randall Munroe";
    comic.firstIdentifier = 1;
    comic.shopUrl = "https://store.kde.org/";

    getComic("User"); // get the latest comic (User)
}

//Retrieved JSON of current comic
pageRetrieved = (id, data, metadata) => {
    if (id == comic.Image) {
        print("Image received");
        return;
    }

    let obj;

    try {
        obj = JSON.parse(data);
    } catch (ex) {
        print("Error: " + ex + "\nTried to parse: " + data)
        comic.error();
        return;
    }

    if (id == comic.User) {
        getComic("Page"); // get the latest comic (Page)
        comic.lastIdentifier = obj.num;
    }

    if (id == comic.Page) {
        processComic(id, obj); // process the comic (Image)
    }
}

// Get the image and metadata of the comic
processComic = (id, jsonData) => {
    // Boring stuff
    print("json data " + JSON.stringify(jsonData) + " identifier " + id + " last identifier " + jsonData.num + " title " + jsonData.title);

    // Set objects properties
    comic.title = jsonData.title;
    comic.websiteUrl = `https://xkcd.com/${jsonData.num}`;
    comic.additionalText = jsonData.alt;

    // Requests the actual comic image
    comic.requestPage(jsonData.img, comic.Image);
}

// Gets the latest comic if identifierSpecified is not set, else it gets the comic with the requested number
getComic = (id) => comic.requestPage(`https://xkcd.com/${comic.identifierSpecified ? comic.identifier + '/' : ''}info.0.json`, id == "Page" ? comic.Page : comic.User);
