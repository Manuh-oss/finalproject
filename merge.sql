
CREATE TABLE `events` (
  `event_id` int(11) NOT NULL,
  `event_tittle` varchar(256) NOT NULL,
  `event_date` varchar(256) NOT NULL,
  `event_description` varchar(256) NOT NULL,
  `event_category` varchar(256) NOT NULL,
  `event_destination` varchar(100) NOT NULL,
  `event_from` varchar(100) NOT NULL,
  `event_to` varchar(100) NOT NULL,
  `event_arrival_time` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `user` varchar(150) NOT NULL,
  `school_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`event_id`, `event_tittle`, `event_date`, `event_description`, `event_category`, `event_destination`, `event_from`, `event_to`, `event_arrival_time`, `user`, `school_id`) VALUES
(1, 'meeting', '13/8/2025', '', 'educative', '1', '', '', '2025-08-03 02:08:38.918064', 'T/SD/2698', 0),
(2, 'meeting day', '13/8/2025', '', 'educative', '1', '', '', '2025-08-03 02:10:53.226424', 'T/SD/2698', 0),
(3, 'meeting day', '13/8/2025', 'a class meeting will be held', 'educative', 'formgrade 9green', '', '', '2025-08-03 02:12:18.882009', 'T/SD/2698', 1),
(4, 'test', '20/8/2025', 'testng testing', 'personal', 'all', '', '', '2025-08-11 13:08:11.649774', 'T/SD/2698', 1);

-- --------------------------------------------------------

--
-- Table structure for table `parents1`
--


CREATE TABLE `parents1` (
  `Parents_id` int(11) NOT NULL,
  `firstname` varchar(256) NOT NULL,
  `middlename` varchar(256) NOT NULL,
  `lastname` varchar(256) NOT NULL,
  `email` varchar(256) NOT NULL,
  `identification` int(11) NOT NULL,
  `admission` int(11) NOT NULL,
  `class` varchar(100) NOT NULL,
  `phone` int(11) NOT NULL,
  `gender` varchar(256) NOT NULL,
  `stream` varchar(100) NOT NULL,
  `type_parent` varchar(100) NOT NULL,
  `profile_image_name` varchar(256) NOT NULL,
  `profile_image_path` varchar(256) NOT NULL,
  `school_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `parents1`
--

INSERT INTO `parents1` (`Parents_id`, `firstname`, `middlename`, `lastname`, `email`, `identification`, `admission`, `class`, `phone`, `gender`, `stream`, `type_parent`, `profile_image_name`, `profile_image_path`, `school_id`) VALUES
(1, 'Judy ', 'Mwikali', 'Mukiti', 'emmanuelmwendwa213@gmail.com', 21639807, 1001, 'grade 9', 725836914, 'male', 'green', 'parent', '', '', 1),
(2, 'Dominic', 'wathome', 'muia', 'emmanuelmwendwa185@gmail.com', 1445678, 0, 'grade 9', 7236208, 'male', 'green', 'parent', '', 'parentsProfile/', 0),
(3, 'Dominic', 'wathome', 'muia', 'emmanuelmwendwa185@gmail.com', 1445678, 0, 'grade 9', 7236208, 'male', 'green', 'parent', '', 'parentsProfile/', 0),
(4, 'Dominic', 'wathome', 'muia', 'emmanuelmwendwa185@gmail.com', 1445678, 0, 'grade 9', 7236208, 'male', 'green', 'parent', '', 'parentsProfile/', 0),
(5, 'dominic', 'wathome', 'muia', 'emmanuelmwendwa185@gmail.com', 21445678, 1002, 'grade 9', 7236208, 'male', 'green', 'parent', '', '', 1),
(6, 'judy', 'mwikali', 'mukiti', 'judymwikali856@gmail.com', 21639807, 1003, 'grade 7', 7236208, 'male', 'green', 'parent', '', '', 1),
(7, 'daniel', 'mutua', 'muuo', 'kennedywathome632@gamil.com', 2456743, 1004, 'grade 7', 78918001, 'male', 'green', 'parent', '', '', 1),
(8, 'paul', 'wathome', 'mukiti', 'judymwikali856@gmail.com', 70769708, 1005, 'grade 7', 72362080, 'male', 'green', 'parent', '', '', 1);

-- --------------------------------------------------------

--
-- Table structure for table `school_timetable`
--
CREATE TABLE `school_timetable` (
  `timetable_id` int(11) NOT NULL,
  `day` varchar(100) NOT NULL,
  `venue` varchar(100) NOT NULL,
  `lesson_one` varchar(256) NOT NULL,
  `lesson_two` varchar(256) NOT NULL,
  `lesson_three` varchar(256) NOT NULL,
  `lesson_four` varchar(256) NOT NULL,
  `lesson_five` varchar(256) NOT NULL,
  `lesson_six` varchar(256) NOT NULL,
  `lesson_seven` varchar(256) NOT NULL,
  `lesson_eight` varchar(256) NOT NULL,
  `lesson_nine` varchar(256) NOT NULL,
  `lesson_ten` varchar(256) NOT NULL,
  `class` varchar(100) NOT NULL,
  `stream` varchar(100) NOT NULL,
  `type` varchar(100) NOT NULL,
  `school_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `school_timetable`
--

INSERT INTO `school_timetable` (`timetable_id`, `day`, `venue`, `lesson_one`, `lesson_two`, `lesson_three`, `lesson_four`, `lesson_five`, `lesson_six`, `lesson_seven`, `lesson_eight`, `lesson_nine`, `lesson_ten`, `class`, `stream`, `type`, `school_id`) VALUES
(1, 'monday', '', '', '', '', '', '', '', '', '', '', '', 'grade 9', 'green', '', 1),
(2, 'tuesday', '', '', '', '', '', '', '', '', '', '', '', 'grade 9', 'green', '', 1),
(3, 'wednesday', '', '', '', '', 'Agriculture-paul-s', '', '', '', '', '', 'Biology-paul-s', 'grade 9', 'green', '', 1),
(4, 'thursday', '', '', '', '', '', '', '', '', '', '', '', 'grade 9', 'green', '', 1),
(5, 'friday', '', '', '', '', '', '', '', '', '', '', '', 'grade 9', 'green', '', 1),
(6, 'monday', '', '', '', '', '', '', '', '', '', '', '', 'grade 7', 'green', '', 1),
(7, 'tuesday', '', '', '', '', '', '', '', '', '', '', '', 'grade 7', 'green', '', 1),
(8, 'wednesday', '', '', '', '', '', 'Biology-paul-s', '', '', '', '', '', 'grade 7', 'green', '', 1),
(9, 'thursday', '', '', '', '', '', '', '', '', '', '', '', 'grade 7', 'green', '', 1),
(10, 'friday', '', '', '', '', '', '', '', '', '', '', '', 'grade 7', 'green', '', 1),
(11, 'monday', '', '', '', '', '', '', '', '', '', '', '', 'grade 8', 'green', '', 1),
(12, 'tuesday', '', 'Chemistry-emmanuel-s', '', '', '', '', '', '', '', '', '', 'grade 8', 'green', '', 1),
(13, 'wednesday', '', '', '', 'Chemistry-emmanuel-s', '', '', '', '', '', '', '', 'grade 8', 'green', '', 1),
(14, 'thursday', '', '', '', '', '', '', '', '', '', '', '', 'grade 8', 'green', '', 1),
(15, 'friday', '', '', '', '', '', '', '', '', '', '', '', 'grade 8', 'green', '', 1);

-- --------------------------------------------------------

--
-- Table structure for table `teachers`
--
CREATE TABLE `teachers` (
  `teacher_id` int(11) NOT NULL,
  `firstname` varchar(256) NOT NULL,
  `middlename` varchar(256) NOT NULL,
  `lastname` varchar(256) NOT NULL,
  `othername` varchar(256) NOT NULL,
  `phone` int(100) NOT NULL,
  `identification` int(100) NOT NULL,
  `dateOfBirth` date NOT NULL,
  `email` varchar(256) NOT NULL,
  `gender` varchar(100) NOT NULL,
  `place` varchar(256) NOT NULL,
  `department` varchar(100) NOT NULL,
  `teachers_code` varchar(100) NOT NULL,
  `subject_one` varchar(256) NOT NULL,
  `subject_two` varchar(256) NOT NULL,
  `adress` varchar(256) NOT NULL,
  `degree` varchar(256) NOT NULL,
  `university` varchar(256) NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL,
  `file_name` varchar(256) NOT NULL,
  `file_path` varchar(256) NOT NULL,
  `classteacher_class` varchar(100) NOT NULL,
  `classteacher_stream` varchar(100) NOT NULL,
  `rank` varchar(256) NOT NULL,
  `aboutMe` varchar(1000) NOT NULL,
  `school_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `teachers`
--

INSERT INTO `teachers` (`teacher_id`, `firstname`, `middlename`, `lastname`, `othername`, `phone`, `identification`, `dateOfBirth`, `email`, `gender`, `place`, `department`, `teachers_code`, `subject_one`, `subject_two`, `adress`, `degree`, `university`, `startDate`, `endDate`, `file_name`, `file_path`, `classteacher_class`, `classteacher_stream`, `rank`, `aboutMe`, `school_id`) VALUES
(1, 'paul', 'mutua', 'muia', '', 7236208, 1212234, '1970-12-12', 'emmanuelmwendwa185@gmail.com', 'male', 'ndalani town, machakos', 'science', 'T/SD/2698', 'biology', 'agriculture', 'ndalani town', 'bachelor of education', 'university of nairobi', '2020-12-12', '2030-12-12', '', '', '', '', 'admin', 'this is a brief story about me', 1),
(2, 'titus', 'okello', 'ombati', '', 789468290, 1234512, '1990-11-12', 'emmanuelmwendwa213@gmail.com', 'male', 'ndalani town, machakos', 'humanity', 'T/HM/2527', 'kiswahili', 'cre', 'machakos town', 'bachelor of education', 'university of nairobi', '2020-11-11', '2030-11-11', '', '', '', '', 'H.O.D-kiswahili', '', 1),
(3, 'elizabeth', 'mwongeli', 'mulei', 'not provided', 7236208, 9876432, '2009-12-12', 'judymwikali856@gmail.com', 'male', 'ndalani town, machakos', 'techinals', 'T/HM/1787', 'subject14', 'french', 'machalos', 'bachelor of education', 'university of eldoret', '2020-12-12', '2030-12-12', '', '', 'playgroup', 'white', 'normal', '', 1),
(4, 'elizabeth', 'mwongeli', 'mulei', 'not provided', 7236208, 9876432, '2009-12-12', 'judymwikali856@gmail.com', 'male', 'ndalani town, machakos', 'techinals', 'T/HM/1787', 'subject14', 'french', 'machalos', 'bachelor of education', 'university of eldoret', '2020-12-12', '2030-12-12', '', '', 'playgroup', 'blue', 'normal', '', 0),
(7, 'Kennedy', 'wathome', 'muia', 'not provided', 721734207, 41350868, '2004-02-27', 'kenwathome632@gmail.com', 'male', 'ndalani town, machakos', 'science', 'T/SD/5171', 'mathematics', 'physics', 'fscvyds', 'bachelor of education', 'university of nairobi', '2013-07-13', '2019-08-03', '', '', '', '', 'admin', '', 4),
(8, 'emmanuel', 'mwendwa', 'muia', '', 745057879, 377415085, '2005-08-30', 'muiyah.emmanuel@gmail.com', 'male', 'umoja three nairobi', 'science', 'T/SD/2304', 'chemistry', 'biology', 'uomja three nairobi', 'bachelor of education', 'university of nairobi', '2020-12-12', '2030-12-12', '', '', '', '', 'admin', '', 1);

-- --------------------------------------------------------

--
-- Table structure for table `teachers_subjects_taught`
--
CREATE TABLE `teachers_subjects_taught` (
  `subject_taught_id` int(11) NOT NULL,
  `teacher_code` varchar(100) NOT NULL,
  `class` varchar(100) NOT NULL,
  `stream` varchar(100) NOT NULL,
  `subject` varchar(256) NOT NULL,
  `school_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `teachers_subjects_taught`
--

INSERT INTO `teachers_subjects_taught` (`subject_taught_id`, `teacher_code`, `class`, `stream`, `subject`, `school_id`) VALUES
(1, 'T/SD/2698', 'grade 9', 'green', 'biology', 0),
(2, 'T/SD/2698', 'grade 9', 'green', 'agriculture', 0),
(3, 'T/SD/2698', 'grade 9', 'green', 'biology', 1),
(4, 'T/SD/2698', 'grade 9', 'green', 'agriculture', 1),
(5, 'T/SD/2698', 'grade 7', 'green', 'biology', 1),
(7, 'T/SD/2698', 'grade 8', 'green', 'biology', 1),
(8, 'T/HM/1787', 'grade 7', 'green', '', 1),
(9, 'T/SD/2698', 'grade 6', 'green', 'biology', 1),
(10, 'T/HM/1787', 'grade 7', 'green', 'subject14', 1),
(11, 'T/SD/2304', 'grade 8', 'green', 'chemistry', 1);

-- --------------------------------------------------------

--
-- Table structure for table `teachers_timetable`
--
CREATE TABLE `teachers_timetable` (
  `timetable_id` int(11) NOT NULL,
  `teacher_code` varchar(256) NOT NULL,
  `day` varchar(256) NOT NULL,
  `lesson_one` varchar(256) NOT NULL,
  `lesson_two` varchar(256) NOT NULL,
  `lesson_three` varchar(256) NOT NULL,
  `lesson_four` varchar(256) NOT NULL,
  `lesson_five` varchar(256) NOT NULL,
  `lesson_six` varchar(256) NOT NULL,
  `lesson_seven` varchar(256) NOT NULL,
  `lesson_eight` varchar(256) NOT NULL,
  `lesson_nine` varchar(256) NOT NULL,
  `lesson_ten` varchar(256) NOT NULL,
  `type` varchar(100) NOT NULL,
  `school_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `teachers_timetable`
--

INSERT INTO `teachers_timetable` (`timetable_id`, `teacher_code`, `day`, `lesson_one`, `lesson_two`, `lesson_three`, `lesson_four`, `lesson_five`, `lesson_six`, `lesson_seven`, `lesson_eight`, `lesson_nine`, `lesson_ten`, `type`, `school_id`) VALUES
(1, 'T/SD/2698', 'monday', '', '', '', '', '', '', '', '', '', '', '', 1),
(2, 'T/SD/2698', 'tuesday', '', '', '', '', '', '', '', '', '', '', '', 1),
(3, 'T/SD/2698', 'wednesday', '', '', '', 'Agriculture-grade 9-green-s', 'Biology-grade 7-green-s', '', '', '', '', 'Biology-grade 9-green-s', '', 1),
(4, 'T/SD/2698', 'thursday', '', '', '', '', '', '', '', '', '', '', '', 1),
(5, 'T/SD/2698', 'friday', '', '', '', '', '', '', '', '', '', '', '', 1),
(6, 'T/SD/2304', 'monday', '', '', '', '', '', '', '', '', '', '', '', 1),
(7, 'T/SD/2304', 'tuesday', 'Chemistry-grade 8-green-s', '', '', '', '', '', '', '', '', '', '', 1),
(8, 'T/SD/2304', 'wednesday', '', '', 'Chemistry-grade 8-green-s', '', '', '', '', '', '', '', '', 1),
(9, 'T/SD/2304', 'thursday', '', '', '', '', '', '', '', '', '', '', '', 1),
(10, 'T/SD/2304', 'friday', '', '', '', '', '', '', '', '', '', '', '', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`event_id`);

--
-- Indexes for table `parents1`
--
ALTER TABLE `parents1`
  ADD PRIMARY KEY (`Parents_id`);

--
-- Indexes for table `school_timetable`
--
ALTER TABLE `school_timetable`
  ADD PRIMARY KEY (`timetable_id`);

--
-- Indexes for table `teachers`
--
ALTER TABLE `teachers`
  ADD PRIMARY KEY (`teacher_id`);

--
-- Indexes for table `teachers_subjects_taught`
--
ALTER TABLE `teachers_subjects_taught`
  ADD PRIMARY KEY (`subject_taught_id`);

--
-- Indexes for table `teachers_timetable`
--
ALTER TABLE `teachers_timetable`
  ADD PRIMARY KEY (`timetable_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `event_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `parents1`
--
ALTER TABLE `parents1`
  MODIFY `Parents_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `school_timetable`
--
ALTER TABLE `school_timetable`
  MODIFY `timetable_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `teachers`
--
ALTER TABLE `teachers`
  MODIFY `teacher_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `teachers_subjects_taught`
--
ALTER TABLE `teachers_subjects_taught`
  MODIFY `subject_taught_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `teachers_timetable`
--
ALTER TABLE `teachers_timetable`
  MODIFY `timetable_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
COMMIT;

CREATE TABLE `assignment` (
  `Assignment_id` int(11) NOT NULL,
  `file_name` varchar(256) NOT NULL,
  `file_path` varchar(256) NOT NULL,
  `subject` varchar(256) NOT NULL,
  `class` int(100) NOT NULL,
  `stream` int(100) NOT NULL,
  `code` varchar(200) NOT NULL,
  `type` varchar(100) NOT NULL,
  `school_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `assignment`
--

INSERT INTO `assignment` (`Assignment_id`, `file_name`, `file_path`, `subject`, `class`, `stream`, `code`, `type`, `school_id`) VALUES
(1, '202312315504259_EMMANUELMUIA.pdf', 'profileImage/php26DF.tmp', 'biology', 0, 111, 'T/SD/2698', 'document', 1);

-- --------------------------------------------------------

--
-- Table structure for table `discplinerecord`
--
CREATE TABLE `discplinerecord` (
  `record_id` int(11) NOT NULL,
  `admission` int(100) NOT NULL,
  `date` varchar(50) NOT NULL,
  `incident` varchar(256) NOT NULL,
  `location` varchar(256) NOT NULL,
  `reportee` varchar(256) NOT NULL,
  `action` varchar(256) NOT NULL,
  `school_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `main`
--

CREATE TABLE `main` (
  `Student_id` int(11) NOT NULL,
  `firstname` varchar(256) NOT NULL,
  `middlename` varchar(256) NOT NULL,
  `lastname` varchar(256) NOT NULL,
  `othername` varchar(256) NOT NULL,
  `email` varchar(256) NOT NULL,
  `admission` int(100) NOT NULL,
  `dateofbirth` date NOT NULL,
  `class` varchar(100) NOT NULL,
  `stream` varchar(100) NOT NULL,
  `admission_date` int(100) NOT NULL,
  `gender` varchar(100) NOT NULL,
  `english_selection` varchar(100) NOT NULL,
  `kiswahili_selection` varchar(100) NOT NULL,
  `mathematics_selection` varchar(100) NOT NULL,
  `chemistry_selection` varchar(100) NOT NULL,
  `biology_selection` varchar(100) NOT NULL,
  `physics_selection` varchar(100) NOT NULL,
  `geography_selection` varchar(100) NOT NULL,
  `history_selection` varchar(100) NOT NULL,
  `cre_selection` varchar(100) NOT NULL,
  `business_selection` varchar(100) NOT NULL,
  `agriculture_selection` varchar(100) NOT NULL,
  `computer_selection` varchar(100) NOT NULL,
  `french_selection` varchar(100) NOT NULL,
  `homescience_selection` varchar(100) NOT NULL,
  `subject14_selection` varchar(100) NOT NULL,
  `subject15_selection` varchar(100) NOT NULL,
  `subject16_selection` varchar(100) NOT NULL,
  `profileImage_name` varchar(100) NOT NULL,
  `profileImage_path` varchar(100) NOT NULL,
  `student_location` varchar(100) NOT NULL,
  `student_address` varchar(100) NOT NULL,
  `school_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `main`
--

INSERT INTO `main` (`Student_id`, `firstname`, `middlename`, `lastname`, `othername`, `email`, `admission`, `dateofbirth`, `class`, `stream`, `admission_date`, `gender`, `english_selection`, `kiswahili_selection`, `mathematics_selection`, `chemistry_selection`, `biology_selection`, `physics_selection`, `geography_selection`, `history_selection`, `cre_selection`, `business_selection`, `agriculture_selection`, `computer_selection`, `french_selection`, `homescience_selection`, `subject14_selection`, `subject15_selection`, `subject16_selection`, `profileImage_name`, `profileImage_path`, `student_location`, `student_address`, `school_id`) VALUES
(1, 'Emmanuel', 'Mwendwa', 'Muia', '', 'emmanuelmwendwa213@gmail.com', 1001, '2006-08-30', 'grade 7', 'green', 0, 'male', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'Nairobi ', 'Umoja three', 1),
(2, 'jeremy', 'muia', 'mbakire', '', 'emmanuelmwendwa185@gmail.com', 1002, '2009-11-12', 'grade 7', 'green', 0, 'male', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'nairobi', 'umoja three', 1),
(3, 'kennedy ', 'wathome', 'muia', '', 'kennedywathome632@gamil.com', 1003, '2003-02-27', 'grade 7', 'green', 0, 'male', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'Nairobi ', 'umoja three, nairobi', 1),
(4, 'joseph', 'wambua', 'maingi', '', 'kennedywathome632@gamil.com', 1004, '2008-12-12', 'grade 7', 'green', 0, 'male', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'nairobi', 'machakos town', 1),
(5, 'john', 'mumo', 'muia', '', 'muiyah.emmanuel@gmail.com', 1005, '2000-12-12', 'grade 7', 'green', 0, 'male', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'martin.jpg', 'profileImages/martin.jpg', 'Nairobi ', 'umoja three', 1);

-- --------------------------------------------------------

--
-- Table structure for table `school-information`
--
CREATE TABLE `school-information` (
  `school_id` int(11) NOT NULL,
  `school_name` varchar(256) NOT NULL,
  `school_address` varchar(500) NOT NULL,
  `subjects` varchar(500) NOT NULL,
  `class` varchar(500) NOT NULL,
  `streams` varchar(500) NOT NULL,
  `layout` varchar(500) NOT NULL,
  `admins` int(100) NOT NULL,
  `school_badge` varchar(256) NOT NULL,
  `subdomain` varchar(256) NOT NULL,
  `email` varchar(256) NOT NULL,
  `activities` varchar(500) NOT NULL,
  `contactInfo` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `school-information`
--

INSERT INTO `school-information` (`school_id`, `school_name`, `school_address`, `subjects`, `class`, `streams`, `layout`, `admins`, `school_badge`, `subdomain`, `email`, `activities`, `contactInfo`) VALUES
(1, 'manuh group of schools', 'p.o box 2134 umoja 3,nairobi', 'english/c-kiswahili/c-mathematics/c-chemistry/s-biology/s-physics/s-geography/h-history/h-cre/h-business/t-agriculture/t-french/t-computer/t-electricity/t', 'playgroup/n/pp-pp1/n/pp-pp2/n/pp-grade 1/n/p-grade 2/n/p-grade 3/n/p-grade 4/n/p-grade 5/n/p-grade 6/n/p-grade 7/n/j-grade 8/n/j-grade 9/n/j', 'playgroup:green/red/purple-pp1:green/red/blue/purple-pp2:green/red/blue/purple-grade 1:green/red/blue/purple-grade 2:green/red/blue/purple-grade 3:green/red/blue/purple-grade 4:green/red/blue/purple-grade 5:green/red/blue/purple-grade 6:green/red/blue/purple-grade 7:green/red/blue/purple-grade 8:green/red/blue/purple-grade 9:green/red/blue/purple', 'sc/motto-“Empowering Minds, Shaping Futures”\r\n\r\nA concise statement that reflects the school’s commitment to nurturing intellect and character.:mission-To be a leading educational institution recognized for excellence in academic achievement, innovation, and holistic development, inspiring every student to reach their full potential and contribute meaningfully to society:vision-Our mission is to provide a safe, inclusive, and stimulating learning environment that fosters intellectual curiosity, ', 0, 'schoolBadges/badge5.jpg', 'manuhAcademy', 'contact.manuhacademy@finewave.com', 'fa-music/drama-fa-futbol/sports -fa-chalkboard/educational', 'weekdays/8.00 am -  4.00 pm-weekend/10.00 am - 3.00 pm-phone2/0757467372-phone1/0745057879');

-- --------------------------------------------------------

--
-- Table structure for table `sliders`
--
CREATE TABLE `sliders` (
  `sliderImage` varchar(500) NOT NULL,
  `sliderH2` varchar(500) NOT NULL,
  `slidertP` varchar(500) NOT NULL,
  `school_id` int(11) NOT NULL,
  `id` int(11) NOT NULL,
  `type` varchar(200) NOT NULL,
  `rank` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sliders`
--

INSERT INTO `sliders` (`sliderImage`, `sliderH2`, `slidertP`, `school_id`, `id`, `type`, `rank`) VALUES
('slider/schoolbus.jpg', 'our school bus', 'our school offers free transport to students', 1, 1, 'slider', ''),
('slider/bg.avif', 'church sponser', 'they embark our students with quality religious background', 1, 2, 'head', 'sponser'),
('slider/sports.jpeg', 'sport activities', 'these are sport activities', 1, 4, 'slider', ''),
('slider/slide1.avif', 'samsung', 'they give our students free phones', 1, 5, 'head', 'patner');

-- --------------------------------------------------------

--
-- Table structure for table `studentdetails`
--
CREATE TABLE `studentdetails` (
  `Student_id` int(11) NOT NULL,
  `firstname` varchar(256) NOT NULL,
  `admission` int(100) NOT NULL,
  `class` varchar(100) NOT NULL,
  `stream` varchar(100) NOT NULL,
  `english` int(100) NOT NULL,
  `english_position` int(100) NOT NULL,
  `kiswahili` int(100) NOT NULL,
  `kiswahili_position` int(100) NOT NULL,
  `mathematics` int(100) NOT NULL,
  `mathematics_position` int(100) NOT NULL,
  `chemistry` int(100) NOT NULL,
  `chemistry_position` int(100) NOT NULL,
  `biology` int(100) NOT NULL,
  `biology_position` int(100) NOT NULL,
  `physics` int(100) NOT NULL,
  `physics_position` int(100) NOT NULL,
  `geography` int(100) NOT NULL,
  `geography_position` int(100) NOT NULL,
  `history` int(100) NOT NULL,
  `history_position` int(100) NOT NULL,
  `cre` int(100) NOT NULL,
  `cre_position` int(100) NOT NULL,
  `businessstudies` int(100) NOT NULL,
  `business_position` int(100) NOT NULL,
  `agriculture` int(100) NOT NULL,
  `agriculture_position` int(100) NOT NULL,
  `computer` int(100) NOT NULL,
  `computer_position` int(100) NOT NULL,
  `french` int(100) NOT NULL,
  `french_position` int(100) NOT NULL,
  `homescience` int(100) NOT NULL,
  `homescience_position` int(100) NOT NULL,
  `subject14` int(100) NOT NULL,
  `subject14_position` int(100) NOT NULL,
  `subject15` int(100) NOT NULL,
  `subject15_position` int(100) NOT NULL,
  `subject16` int(100) NOT NULL,
  `subject16_position` int(100) NOT NULL,
  `Total` int(100) NOT NULL,
  `Total_position` int(100) NOT NULL,
  `Totals` int(100) NOT NULL,
  `Totals_position` int(100) NOT NULL,
  `mean` int(100) NOT NULL,
  `mean_position` int(100) NOT NULL,
  `Grade` varchar(100) NOT NULL,
  `exam` int(100) NOT NULL,
  `term` int(100) NOT NULL,
  `remarks` varchar(500) NOT NULL,
  `school_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `studentdetails`
--

INSERT INTO `studentdetails` (`Student_id`, `firstname`, `admission`, `class`, `stream`, `english`, `english_position`, `kiswahili`, `kiswahili_position`, `mathematics`, `mathematics_position`, `chemistry`, `chemistry_position`, `biology`, `biology_position`, `physics`, `physics_position`, `geography`, `geography_position`, `history`, `history_position`, `cre`, `cre_position`, `businessstudies`, `business_position`, `agriculture`, `agriculture_position`, `computer`, `computer_position`, `french`, `french_position`, `homescience`, `homescience_position`, `subject14`, `subject14_position`, `subject15`, `subject15_position`, `subject16`, `subject16_position`, `Total`, `Total_position`, `Totals`, `Totals_position`, `mean`, `mean_position`, `Grade`, `exam`, `term`, `remarks`, `school_id`) VALUES
(1, '', 1001, 'grade 9', 'green', 0, 0, 0, 0, 0, 0, 0, 0, 72, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 30, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 102, 0, 102, 0, 6, 2, 'e', 22, 2, '', 1),
(2, '', 1002, 'grade 9', 'green', 0, 0, 0, 0, 0, 0, 0, 0, 59, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 90, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 149, 0, 149, 0, 9, 1, 'e', 22, 2, '', 1),
(3, '', 1001, 'grade 8', 'green', 0, 0, 0, 0, 0, 0, 0, 0, 88, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 88, 0, 88, 0, 6, 1, 'e', 22, 2, '', 1),
(4, '', 1002, 'grade 8', 'green', 0, 0, 0, 0, 0, 0, 0, 0, 65, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 65, 0, 65, 0, 4, 2, 'e', 22, 2, '', 1),
(5, '', 1001, 'grade 7', 'green', 0, 0, 0, 0, 0, 0, 0, 0, 56, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 56, 0, 56, 0, 4, 2, 'e', 22, 2, '', 1),
(6, '', 1002, 'grade 7', 'green', 0, 0, 0, 0, 0, 0, 0, 0, 78, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 78, 0, 78, 0, 5, 1, 'e', 22, 2, '', 1),
(7, '', 1001, 'grade 7', 'green', 0, 0, 0, 0, 0, 0, 0, 0, 87, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 87, 0, 87, 0, 5, 1, 'e', 22, 1, '', 1),
(8, '', 1002, 'grade 7', 'green', 0, 0, 0, 0, 0, 0, 0, 0, 60, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 60, 0, 60, 0, 4, 2, 'e', 22, 1, '', 1),
(9, '', 1001, 'grade 7', 'green', 0, 0, 0, 0, 0, 0, 0, 0, 58, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 58, 0, 58, 0, 4, 2, 'e', 22, 3, '', 1),
(10, '', 1002, 'grade 7', 'green', 0, 0, 0, 0, 0, 0, 0, 0, 79, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 79, 0, 79, 0, 5, 1, 'e', 22, 3, '', 1),
(11, '', 1003, 'grade 7', 'green', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '', 22, 2, '', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `assignment`
--
ALTER TABLE `assignment`
  ADD PRIMARY KEY (`Assignment_id`);

--
-- Indexes for table `discplinerecord`
--
ALTER TABLE `discplinerecord`
  ADD PRIMARY KEY (`record_id`);


--
-- Indexes for table `main`
--
ALTER TABLE `main`
  ADD PRIMARY KEY (`Student_id`);

--
-- Indexes for table `school-information`
--
ALTER TABLE `school-information`
  ADD PRIMARY KEY (`school_id`);

--
-- Indexes for table `sliders`
--
ALTER TABLE `sliders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `studentdetails`
--
ALTER TABLE `studentdetails`
  ADD PRIMARY KEY (`Student_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `assignment`
--
ALTER TABLE `assignment`
  MODIFY `Assignment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `discplinerecord`
--
ALTER TABLE `discplinerecord`
  MODIFY `record_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `main`
--
ALTER TABLE `main`
  MODIFY `Student_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `school-information`
--
ALTER TABLE `school-information`
  MODIFY `school_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `sliders`
--
ALTER TABLE `sliders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `studentdetails`
--
ALTER TABLE `studentdetails`
  MODIFY `Student_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
COMMIT;

CREATE TABLE `class_register` (
  `register_id` int(11) NOT NULL,
  `school_id` int(10) NOT NULL,
  `class` varchar(100) NOT NULL,
  `session` varchar(100) NOT NULL,
  `start_status` varchar(100) NOT NULL,
  `day` varchar(100) NOT NULL,
  `date` varchar(100) NOT NULL,
  `code` varchar(100) NOT NULL,
  `end_status` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notes`
--
CREATE TABLE `notes` (
  `notes_id` int(11) NOT NULL,
  `paragraph` mediumtext NOT NULL,
  `class` varchar(100) NOT NULL,
  `subject` varchar(150) NOT NULL,
  `teacherCode` varchar(100) NOT NULL,
  `topic` varchar(150) NOT NULL,
  `school_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--
CREATE TABLE `notifications` (
  `notification_id` int(11) NOT NULL,
  `destination` varchar(100) NOT NULL,
  `message` varchar(500) NOT NULL,
  `frum` varchar(100) NOT NULL,
  `description` varchar(500) NOT NULL,
  `type` varchar(256) NOT NULL,
  `school_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`notification_id`, `destination`, `message`, `frum`, `description`, `type`, `school_id`) VALUES
(1, 'teacher-grade 9', 'The midterm exam for Formgrade 9 has just been set', 'H.O.D-examination', 'new midterm exam for formgrade 9 was just uploaded wanna check out', 'educative-exam-grade 9', 0),
(2, 'student-grade 9', 'Mr paul has just uploaded a biology assignment', 'T/SD/2698', '\r\n        📘 New assignment \"<strong>202312315504259_EMMANUELMUIA.pdf</strong>\" has been posted in <strong>biology / formgrade 9</strong>. Check it out!\r\n      ', 'educative-assignment-grade 9', 0),
(3, 'teacher-grade 9', 'The midterm exam for Formgrade 9 has just been set', 'H.O.D-examination', 'new midterm exam for formgrade 9 was just uploaded wanna check out', 'educative-exam-grade 9', 1),
(4, 'teachers-all', 'kiswahili topics have just been added', 'H.O.D-kiswahili', '11 topics have just been added </br>you can now succesfully add:notes,quizes e.t.c', 'educative-topic-all', 1),
(5, 'teachers-all', 'kiswahili topics have just been updated', 'H.O.D-kiswahili', '11 topics have just been added </br>you can now succesfully add:notes,quizes e.t.c', 'educative-topic-all', 1),
(6, 'teacher-grade 8', 'The midterm exam for Formgrade 8 has just been set', 'H.O.D-examination', 'new midterm exam for formgrade 8 was just uploaded wanna check out', 'educative-exam-grade 8', 1),
(7, 'teacher-grade 7', 'The midterm exam for Formgrade 7 has just been set', 'H.O.D-examination', 'new midterm exam for formgrade 7 was just uploaded wanna check out', 'educative-exam-grade 7', 1);

-- --------------------------------------------------------

--
-- Table structure for table `school_quiz`
--
CREATE TABLE `school_quiz` (
  `Quiz_id` int(11) NOT NULL,
  `question` varchar(500) NOT NULL,
  `answer1` varchar(400) NOT NULL,
  `answer2` varchar(400) NOT NULL,
  `answer3` varchar(400) NOT NULL,
  `answer4` varchar(400) NOT NULL,
  `correct_answer` varchar(400) NOT NULL,
  `solution` varchar(1000) NOT NULL,
  `subjects` varchar(400) NOT NULL,
  `topic_heading` varchar(256) NOT NULL,
  `Quiz_code` int(100) NOT NULL,
  `quiz_duration` varchar(256) NOT NULL,
  `teacher_code` varchar(150) NOT NULL,
  `class` varchar(100) NOT NULL,
  `quizDate` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `type` varchar(100) NOT NULL,
  `school_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `student_quiz_result`
--
CREATE TABLE `student_quiz_result` (
  `Score_id` int(100) NOT NULL,
  `score` varchar(100) NOT NULL,
  `admission` int(100) NOT NULL,
  `attempt` int(100) NOT NULL,
  `quizCode` int(100) NOT NULL,
  `topic` varchar(500) NOT NULL,
  `attemptDate` varchar(150) NOT NULL,
  `school_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `topics`
--
CREATE TABLE `topics` (
  `Topic_id` int(11) NOT NULL,
  `Topic_number` varchar(500) NOT NULL,
  `Topic_heading` varchar(400) NOT NULL,
  `Topic_brief` varchar(400) NOT NULL,
  `subject` varchar(400) NOT NULL,
  `class` varchar(20) NOT NULL,
  `school_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `topics`
--

INSERT INTO `topics` (`Topic_id`, `Topic_number`, `Topic_heading`, `Topic_brief`, `subject`, `class`, `school_id`) VALUES
(1, 'utangulizi', '1', 'utangulizi wa mambo vyote katika lugha ya kiswahili', '', 'grade 9', 1),
(2, 'i', 'utangulizi', 'wah arada', 'kiswahili', 'grade 10', 1);

-- --------------------------------------------------------

--
-- Table structure for table `weekone`
--
CREATE TABLE `weekone` (
  `register_id` int(11) NOT NULL,
  `monday` varchar(100) NOT NULL,
  `tuesday` varchar(100) NOT NULL,
  `wednesday` varchar(100) NOT NULL,
  `thursday` varchar(100) NOT NULL,
  `friday` varchar(100) NOT NULL,
  `admission` int(11) NOT NULL,
  `week` int(11) NOT NULL,
  `school_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `class_register`
--
ALTER TABLE `class_register`
  ADD PRIMARY KEY (`register_id`);

--
-- Indexes for table `notes`
--
ALTER TABLE `notes`
  ADD PRIMARY KEY (`notes_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`notification_id`);

--
-- Indexes for table `school_quiz`
--
ALTER TABLE `school_quiz`
  ADD PRIMARY KEY (`Quiz_id`);

--
-- Indexes for table `student_quiz_result`
--
ALTER TABLE `student_quiz_result`
  ADD PRIMARY KEY (`Score_id`);

--
-- Indexes for table `topics`
--
ALTER TABLE `topics`
  ADD PRIMARY KEY (`Topic_id`);

--
-- Indexes for table `weekone`
--
ALTER TABLE `weekone`
  ADD PRIMARY KEY (`register_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `class_register`
--
ALTER TABLE `class_register`
  MODIFY `register_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notes`
--
ALTER TABLE `notes`
  MODIFY `notes_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `notification_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `school_quiz`
--
ALTER TABLE `school_quiz`
  MODIFY `Quiz_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `student_quiz_result`
--
ALTER TABLE `student_quiz_result`
  MODIFY `Score_id` int(100) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `topics`
--
ALTER TABLE `topics`
  MODIFY `Topic_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `weekone`
--
ALTER TABLE `weekone`
  MODIFY `register_id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;
