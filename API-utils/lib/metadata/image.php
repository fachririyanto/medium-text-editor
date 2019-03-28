<?php
/**
 * Image class object.
 * This is used for find a perfect image to show as a thumbnail of a website.
 * @author Fachri Riyanto
 * @version 1.0.0
 */
class Image {
    /**
     * Get real path extention.
     * @param string $path Path or URL.
     * @return string $extention Extention of path.
     */
    function getRealExt($path) {
        $ext = pathinfo($path, PATHINFO_EXTENSION);
        $ext = explode('?', $ext);
        return $ext[0];
    }

    /**
     * Find fit image to use for thumbnail.
     * @param array $images List of images.
     * @param int $index Priority.
     * @return string $image Image URL.
     * @since 1.0.0
     */
    function findImage($images, $pattern, $index = 1) {
        $image = false;
        $isFound = false;

        foreach ($images as $item) {
            if ($isFound) break;

            $imageUrl = $this->getImageUrl($item, $pattern);
            $ext = $this->getRealExt($imageUrl);

            switch ($index) {
                case 1:
                    if (in_array($ext, array('jpg', 'jpeg'))) {
                        $image = $item;
                        $isFound = true;
                    }
                    break;
                case 2:
                    if (in_array($ext, array('png'))) {
                        $image = $item;
                        $isFound = true;
                    }
                    break;
                case 3:
                    return false;
            }
        }

        if (!$image) {
            return $this->findImage($images, $pattern, ++$index);
        }
        return $image;
    }

    /**
     * Get image URL from HTML tag.
     * @param string $tag Image tag HTML.
     * @param string $pattern Pattern of tag.
     * @return $imageUrl Image URL.
     * @since 1.0.0
     */
    function getImageUrl($tag, $pattern) {
        $doc = new DOMDocument();
        $doc->loadHTML($tag);
        $xpath = new DOMXPath($doc);
        $src = $xpath->evaluate($pattern);
        return $src;
    }

    /**
     * Get list of images from HTML tag.
     * @param string $html HTML tag.
     * @param int $index Priority of image tag.
     * @param string $pattern Pattern of tag.
     * @return array $images List of images.
     * @since 1.0.0
     */
    function getImage($html, $index = 1, $pattern = '') {
        $image = false;
        $pattern = '';

        switch ($index) {
            case 1:
                preg_match_all('/<meta [^>]+="og:image"[^>]+>/i', $html, $images);
                $image = empty($images[0][0]) ? false : $images[0][0];
                $pattern = "string(//meta/@content)";
                break;

            case 2:
                preg_match_all('/<meta [^>]+="image"[^>]+>/i', $html, $images);
                $image = empty($images[0][0]) ? false : $images[0][0];
                $pattern = "string(//meta/@content)";
                break;

            case 3:
                preg_match_all('/<link [^>]+="apple-touch-icon"[^>]+>/i', $html, $images);
                $image = empty($images[0][0]) ? false : $images[0][0];
                $pattern = "string(//link/@href)";
                break;

            case 4:
                preg_match_all('/<img[^>]+>/i', $html, $images);
                $pattern = "string(//img/@src)";

                if (empty($images[0][0])) {
                    $image = false;
                } else {
                    $image = $this->findImage($images[0], $pattern);
                }
                break;

            case 5:
                preg_match_all('/<img[^>]+>/i', $html, $images);
                $pattern = "string(//img/@data-src)";

                if (empty($images[0][0])) {
                    $image = false;
                } else {
                    $image = $this->findImage($images[0], $pattern);
                }
                break;

            case 6:
                preg_match_all('/<link [^>]+="icon"[^>]+>/i', $html, $images);
                $image = empty($images[0][0]) ? false : $images[0][0];
                $pattern = "string(//link/@href)";
                break;

            default:
                return false;
        }

        if (!$image) {
            return $this->getImage($html, ++$index, $pattern);
        }

        $src = $this->getImageUrl($image, $pattern);
        if (!filter_var($src, FILTER_VALIDATE_URL)) {
            return $this->getImage($html, ++$index, $pattern);
        }
        return $src;
    }
}