﻿using Microsoft.EntityFrameworkCore;

namespace api.Models;

public class Post
{
    public string? Id { get; set; }
    public string? PosterId { get; set; }
    public string? SchoolId { get; set; }

    public School? School { get; set; }
    public SchoolType? SchoolType { get; set; }

    public string? PostTitle { get; set; }
    public string? PostDescription { get; set; }

    public List<PrimarySchoolSubject>? PrimarySchoolSubjects { get; set; }
    public List<SecondarySchoolSubject>? SecondarySchoolSubjects { get; set; }
    public List<Grade>? Grades { get; set; }
    
    // TODO: Attach documents
}

public enum Grade
{
    PreK,
    Kindergarten,
    One,
    Two,
    Three,
    Four,
    Five,
    Six,
    Seven,
    Eight,
    Nine,
    Ten,
    Eleven,
    Twelve
}



public enum PrimarySchoolSubject
{
    FrenchImmersion,
    CoreFrench,
    ArtsEd,
    General
}

public enum SecondarySchoolSubject // TODO: ADD ALL 
{
    English,
    Math,
    Science,
    History,
    SocialStudies
}
